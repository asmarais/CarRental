import { Component, HostListener, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Subject, debounceTime } from 'rxjs';
import { LoadingService } from '../loading-service.service';  // Assurez-vous que le chemin est correct
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map!: L.Map;
  userLocation = { lat: 0, lng:0 };
  userOriginalLocation = { lat: 0, lng:0 };
  noCarsMessage: string = '';
  routeLayer!: L.Polyline;
  dropOffLocation: string = '';
  circle!: L.Circle;
  mapClickMode = false;
  currentLocationAddress: string = '';
  OfftLocationAddress: string = '';
  dropOffMarker!: L.Marker | null;
  userMarker!: L.Marker | null; // Variable to store the user marker
  isDarkModeEnabled: boolean = false; // Déclarez la propriété et initialisez-la à `false`
  selectedCarPosition: { lat: number; lng: number } | null = null;

  PositionIcon = L.icon({  // Définir l'icône pour les voitures
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1088/1088372.png', // Remplacez par le chemin de l'icône de voiture
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  cars = [
    { name: 'Car 1', position: { lat: 35.679, lng: 10.124 }, image: 'https://via.placeholder.com/100x50', price: '$50/day', color: 'Red' },
    { name: 'Car 2', position: { lat: 35.677, lng: 10.122 }, image: 'https://via.placeholder.com/100x50', price: '$60/day', color: 'Blue' },
    { name: 'Car 3', position: { lat: 35.6785, lng: 10.125 }, image: 'https://via.placeholder.com/100x50', price: '$55/day', color: 'Green' },
    { name: 'Car 4', position: { lat: 35.6782, lng: 10.1215 }, image: 'https://via.placeholder.com/100x50', price: '$70/day', color: 'Yellow' },
    { name: 'Car 5', position: { lat: 36.837511, lng: 10.151681 }, image: 'https://via.placeholder.com/100x50', price: '$70/day', color: 'Yellow' },
    { name: 'Car in Rades', position: { lat: 36.7489, lng: 10.177 } },  // Voiture à Rades
    { name: 'Car in Laouina', position: { lat: 36.835, lng: 10.209 } }, // Voiture à Laouina
    { name: 'Car in Marsa', position: { lat: 36.8833, lng: 10.311 } }
  ];

  userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/219/219964.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  carIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4736/4736213.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });


  userid: '' | undefined;
  ngOnInit() {
    /*const userData = this.authService.getUserDataFromToken();
    console.log('User data:', userData);
    const username = userData.username;
    this.userid = username;*/

    window.scrollTo(0, 0);
    this.getUserLocation();
    (window as any).selectCar = this.displayRouteToCar.bind(this);
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.userOriginalLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.reverseGeocode(this.userLocation.lat, this.userLocation.lng);  // Get the address of the user
          this.initMap();  // Initialize the map centered on the user's location
          this.checkNearbyCars();
        },
        (error) => {
          alert('Geolocation is not supported or failed to retrieve location.');
        }
      );

    } else {
      alert('Geolocation is not supported by this browser.');
    }

  }

  initMap() {
    this.map = L.map('map').setView([this.userLocation.lat, this.userLocation.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20 }).addTo(this.map);

    this.circle = L.circle([this.userLocation.lat, this.userLocation.lng], {
      radius: 1000,
      color: 'RED',
      fillColor: '#a1c4fd',
      fillOpacity: 0.2,
    }).addTo(this.map);
    this.circle.getElement()?.setAttribute('style', 'pointer-events: none;');

    L.marker([this.userLocation.lat, this.userLocation.lng], { icon: this.userIcon })
      .addTo(this.map)
      .bindPopup('Your location')
      .openPopup();

      this.cars.forEach(car => {
        this.addCarMarker(car);
      });

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        if (this.mapClickMode) {
          this.mapClickMode = false;
          document.getElementById('map')?.classList.remove('map-select-cursor');
          this.handleMapClick(e.latlng.lat, e.latlng.lng);
        }
      });
  }


  addCarMarker(car: any) {
    const popupContent = `
      <div>
        <img src="${car.image}" alt="${car.name}" style="width: 100px; height: 50px;">
        <p><strong>Price:</strong> ${car.price}</p>
        <p><strong>Color:</strong> ${car.color}</p>
        <button onclick="window.selectCar(${car.position.lat}, ${car.position.lng})">Select Car</button>
      </div>
    `;

    L.marker([car.position.lat, car.position.lng], { icon: this.carIcon })
      .addTo(this.map)
      .bindPopup(popupContent);
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  checkNearbyCars() {
    const nearbyCars = this.cars.filter(car => {
      const distance = this.calculateDistance(this.userLocation.lat, this.userLocation.lng, car.position.lat, car.position.lng);
      return distance <= 1;
    });

    this.noCarsMessage = nearbyCars.length === 0 ? 'No cars within 1 km around you' : '';
  }

  displayRouteToCar(lat: number, lng: number) {
    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${this.userLocation.lng},${this.userLocation.lat};${lng},${lat}?overview=full&geometries=geojson`;
    this.selectedCarPosition = { lat, lng }; // Save the car's position

    fetch(routeUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.routes && data.routes.length > 0) {
          const route = data.routes[0].geometry.coordinates;
          const latLngs = route.map((point: [number, number]) => [point[1], point[0]]);

          if (this.routeLayer) {
            this.routeLayer.remove();
          }

          this.routeLayer = L.polyline(latLngs, { color: 'blue', weight: 5 }).addTo(this.map);

          this.map.fitBounds(this.routeLayer.getBounds());
        }
      })
      .catch(error => console.error('Error fetching route data:', error));
  }
  cancelCarSelection(){
    if (this.routeLayer) {
      this.routeLayer.remove();
      this.selectedCarPosition=null;
    }
  }


  private searchSubjectOff = new Subject<string>();
  private searchSubject = new Subject<string>();

  constructor(private http: HttpClient, private loadingService: LoadingService, private authService: AuthService) {
    // Abonnez-vous au sujet avec debounceTime
    this.searchSubjectOff.pipe(debounceTime(1000)).subscribe(query => {
      if (query.length > 0) {
        this.geocodeOff(query);  // Lancez la recherche après un délai
      }
    });
     // Abonnez-vous au sujet avec debounceTime
     this.searchSubject.pipe(debounceTime(1000)).subscribe(query => {
      if (query.length > 0) {
        this.geocode(query);  // Lancez la recherche après un délai
      }
    });
  }
   // Fonction déclenchée lors de la saisie de l'utilisateur dans le champ principal
   onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query); // Émet la valeur saisie
  }

  // Fonction déclenchée lors de la saisie de l'utilisateur dans le champ "Off"
  onSearchOff(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubjectOff.next(query); // Émet la valeur saisie
  }
  geocode(query: string) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);

          this.updateUserLocation(lat, lon);  // Update the location of the user based on geocoding
        }
      })
      .catch(error => console.error('Error fetching geocoding data:', error));
  }
  geocodeOff(query: string) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);

          this.dropOffLocation = `Lat: ${lat.toFixed(8)}, Lng: ${lon.toFixed(8)}`;

          this.dropOffMarker = L.marker([lat, lon], { icon: this.PositionIcon })
            .addTo(this.map)
            .bindPopup('Drop-Off Location')
            .openPopup();
        }

      })
      .catch(error => console.error('Error fetching geocoding data:', error));
  }
  updateUserLocation(lat: number, lon: number) {
    if (this.userMarker) {
      this.map.removeLayer(this.userMarker); // Remove the old marker
    }
    // Update the user location
    const userNewLocation = { lat, lng: lon };
    this.userLocation = userNewLocation;

    // Update the map's center
    this.map.setView([lat, lon], 13);
    // Update the marker (user icon)
     this.userMarker = L.marker([lat, lon], { icon: this.userIcon }).addTo(this.map).bindPopup('New location ').openPopup();
     this.checkNearbyCars();
    // Update the circle
    if (this.circle) {
      this.circle.setLatLng([lat, lon]);
    } else {
      this.circle = L.circle([lat, lon], {
        radius: 1000,
        color: 'RED',
        fillColor: '#a1c4fd',
        fillOpacity: 0.2,
      }).addTo(this.map);
    }

    // Update the address field
    this.reverseGeocode(lat, lon);
     // Recalculate the route if a car is selected
    if (this.selectedCarPosition) {
      this.displayRouteToCar(this.selectedCarPosition.lat, this.selectedCarPosition.lng);
  }
  }

  goToCurrentLocation() {
    // Vérifier si la position actuelle de l'utilisateur est définie
    if (this.userOriginalLocation && this.userOriginalLocation.lat && this.userOriginalLocation.lng) {
      // Mettre à jour la vue de la carte vers la position actuelle de l'utilisateur
      this.map.setView([this.userOriginalLocation.lat, this.userOriginalLocation.lng], 13);
      this.reverseGeocode(this.userOriginalLocation.lat, this.userOriginalLocation.lng);

      // Réinitialiser le marqueur de l'utilisateur à sa position actuelle
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker); // Supprimer l'ancien marqueur
      }

      // Ajouter un nouveau marqueur à la position actuelle
      this.userMarker = L.marker([this.userOriginalLocation.lat, this.userOriginalLocation.lng], { icon: this.userIcon }).addTo(this.map).bindPopup('Your location').openPopup();

      // Réinitialiser le cercle autour de la position actuelle
      if (this.circle) {
        this.circle.setLatLng([this.userOriginalLocation.lat, this.userOriginalLocation.lng]);
      } else {
        this.circle = L.circle([this.userOriginalLocation.lat, this.userOriginalLocation.lng], {
          radius: 1000,
          color: 'RED',
          fillColor: '#a1c4fd',
          fillOpacity: 0.2,
        }).addTo(this.map);
      }
     // Réinitialiser la position affichée dans `userLocation`
     this.userLocation = { ...this.userOriginalLocation };
     this.checkNearbyCars();
   }
   // Afficher la route vers la voiture sélectionnée, si une voiture est sélectionnée
   if (this.selectedCarPosition) {
    this.displayRouteToCar(this.selectedCarPosition.lat, this.selectedCarPosition.lng);
  }
  }

  chooseDropOffLocationOnMap() {
    if (this.dropOffMarker) {
      return;
    }

    this.activateDropOffLocationSelection();

    this.map.once('click', (event: L.LeafletMouseEvent) => {
      this.cancelDropOffLocationSelection();

      const { lat, lng } = event.latlng;
      this.dropOffLocation = `Lat: ${lat.toFixed(8)}, Lng: ${lng.toFixed(8)}`;

      this.dropOffMarker = L.marker([lat, lng] , { icon: this.PositionIcon })
        .addTo(this.map)
        .bindPopup('Drop-Off Location')
        .openPopup();
    });
  }

  activateDropOffLocationSelection() {
    this.mapClickMode = true;
    document.getElementById('map')?.classList.add('map-select-cursor');
  }


// Close the map mode on pressing 'Escape'
@HostListener('document:keydown.escape', ['$event'])
onEscape(event: KeyboardEvent) {
  if (this.mapClickMode) {
    this.cancelDropOffLocationSelection();
  }
}
cancelDropOffLocationSelection() {
  this.mapClickMode = false;
  document.getElementById('map')?.classList.remove('map-select-cursor');
  this.resetDropOffLocation(); // Ensures that any existing marker is removed
}

resetDropOffLocation() {

  if (this.dropOffMarker) {
    this.dropOffMarker.remove();  // Remove the marker from the map
    this.dropOffMarker = null;    // Clear the marker reference
    this.dropOffLocation = '';    // Clear the stored drop-off location
    this.OfftLocationAddress = ''; // Clear the displayed address
  }
}


    handleMapClick(lat: number, lng: number) {
      const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

      fetch(reverseGeocodeUrl)
        .then(response => response.json())
        .then(data => {
          if (data && data.address) {
            // Update the address display with the reverse-geocoded location
            this.OfftLocationAddress = data.display_name;
            document.getElementById('dropoff-location')?.setAttribute('value', this.OfftLocationAddress);
            this.dropOffLocation = `${data.address.road || ''}, ${data.address.city || ''}, ${data.address.country || ''}`;
            console.log('Drop-off location selected:', this.dropOffLocation);
          }
        })
        .catch(error => console.error('Error fetching reverse geocoding data:', error));
    }

  reverseGeocode(lat: number, lng: number) {
    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    fetch(reverseGeocodeUrl)
      .then(response => response.json())
      .then(data => {
        this.currentLocationAddress = data.display_name;
      })
      .catch(error => console.error('Error fetching reverse geocoding data:', error));
  }

  goPay() {
    this.loadingService.openLoadingPageAndNavigate('/user/pay', 1700);  // Naviguer vers '/user/profil' après 3 secondes
  }

  pickupLocation: string = '';
  pickupDate: string = '';
  dropOffDate: string = '';
  pickupTime: string = '';

  
  apiUrl = 'http://localhost:5000/api/reservations'; // Remplacez par votre URL d'API


  submitReservation(form: any) {
    if (form.valid) {
      const reservationPayload = {
        date_debut: this.pickupDate + 'T' + this.pickupTime + 'Z', // Format ISO 8601
        date_fin: this.dropOffDate + 'T' + this.pickupTime + 'Z', // Format ISO 8601
        user_id: this.userid, 
        voiture_id: 5, 
        statut: true, 
        avis: "", 
        token_qr: '', 
        pickup_location: this.pickupLocation,
        dropoff_location: this.dropOffLocation
      };

      this.http.post(this.apiUrl, reservationPayload).subscribe(
        response => {
          console.log('Réservation créée avec succès:', response);
          alert('Réservation effectuée avec succès!');
        },
        error => {
          console.error('Erreur lors de la création de la réservation:', error);
          alert('Erreur lors de la réservation.');
        }
      );
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

 

}
