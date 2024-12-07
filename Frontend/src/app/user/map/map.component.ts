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
  dropOffCircle!: L.Circle;
  inValidMessage: string = '';
  mapClickMode = false;
  currentLocationAddress: string = '';
  OfftLocationAddress: string = '';
  dropOffMarker!: L.Marker | null;
  userMarker!: L.Marker | null; // Variable to store the user marker
  isDarkModeEnabled: boolean = false; // Déclarez la propriété et initialisez-la à `false`
  selectedCarPosition: { lat: number; lng: number } | null = null;

  // Dans votre composant Angular
  voitures: any[] = [];
  selectedCarId: number | null = null;
  pickupDate: string = '';
  pickupTime: string = '';
  dropOffDate: string = '';
  pickupLocation: string = '';

  PositionIcon = L.icon({  // Définir l'icône pour les voitures
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1088/1088372.png', // Remplacez par le chemin de l'icône de voiture
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  cars: any[] = [];

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
    const userData = this.authService.getUserDataFromToken();
    console.log('User data:', userData);
    const username = userData.userId;
    this.userid = username;
    console.log(this.userid);

    window.scrollTo(0, 0);
    this.getUserLocation();
    (window as any).selectCar = this.displayRouteToCar.bind(this);
    this.fetchCars();
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

  async initMap() {
    this.map = L.map('map').setView([this.userLocation.lat, this.userLocation.lng], 13);
  
    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20 }).addTo(this.map);
  
    // Add a circle around the user location
    this.circle = L.circle([this.userLocation.lat, this.userLocation.lng], {
      radius: 1000,
      color: 'RED',
      fillColor: '#a1c4fd',
      fillOpacity: 0.2,
    }).addTo(this.map);
    this.circle.getElement()?.setAttribute('style', 'pointer-events: none;');
  
    // Add a marker for the user location
    L.marker([this.userLocation.lat, this.userLocation.lng], { icon: this.userIcon })
      .addTo(this.map)
      .bindPopup('Your location')
      .openPopup();
  
    // Wait for all the car markers and drop-off locations to be added
    for (const car of this.cars) {
      await this.addCarMarker(car);  // Assuming addCarMarker is an async function
  
      // Add a marker for the drop-off location
      try {
        const dropOffLatLng = await this.geocodeAddress(car.pik_off_position);
        console.log(dropOffLatLng);
  
        // Create a yellow circle of 500m radius at the drop-off location
        const dropOffCircle = L.circle([dropOffLatLng.lat, dropOffLatLng.lng], {
          radius: 500, // 500 meters
          color: 'yellow',
          fillColor: 'yellow',
          fillOpacity: 0.2,
        }).addTo(this.map);
        dropOffCircle.getElement()?.setAttribute('style', 'pointer-events: none;');
  
        const labelText = 'Drop-off Zone';
  
        // Create a DivIcon to display text
        const dropOffLabel = L.divIcon({
          className: 'circle-label',  // CSS class for styling the text
          html: `<div style="color:black; cursor: none; pointer-events: none;" class="drop-off-text">${labelText}</div>`,
          iconSize: [75, 0],  // Text size
          iconAnchor: [40, 10], // Anchor the text to the center of the circle
        });
  
        // Add the icon (marker with text) to the map
        L.marker([dropOffLatLng.lat, dropOffLatLng.lng], { icon: dropOffLabel }).addTo(this.map);
      } catch (error) {
        console.error('Error geocoding drop-off location:', error);
      }
    }
  
    // Event listener for map clicks
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.mapClickMode) {
        this.mapClickMode = false;
        document.getElementById('map')?.classList.remove('map-select-cursor');
        this.handleMapClick(e.latlng.lat, e.latlng.lng);
      }
    });
  }
  

  fetchCars() {
    this.http.get('http://localhost:5000/api/voitures').subscribe(
      (response: any) => {
        this.voitures = response;
        this.cars = response;  // Assuming the response is an array of cars
        this.displayCarMarkers();  // Display cars on the map after fetching
      },
      (error) => {
        console.error('Error fetching cars:', error);
      }
    );
  }

   // Function to convert address to lat/lng using Nominatim API
   geocodeAddress(address: string): Promise<{ lat: number, lng: number }> {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    return fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        } else {
          throw new Error('Address not found');
        }
      })
      .catch((error) => {
        console.error('Error geocoding address:', error);
        return { lat: 0, lng: 0 };  // Default to 0,0 if geocoding fails
      });
  }

  // Function to display car markers on the map
  displayCarMarkers() {
    this.cars.forEach((car) => {
      this.geocodeAddress(car.pik_up_position).then((coords) => {
        const popupContent = `
          <div>
            <p><strong>Model:</strong> ${car.modele}</p>
            <p><strong>Price:</strong> $${car.prix_par_jour}/day</p>
            <p><strong>Location:</strong> ${car.pik_up_position}</p>
            <button onclick="window.selectCar(${coords.lat}, ${coords.lng})">Select Car</button>
          </div>
        `;

        L.marker([coords.lat, coords.lng], { icon: this.carIcon })
          .addTo(this.map)
          .bindPopup(popupContent);
      });
    });
  }

  

  // Example method to handle car selection
  displayRouteToCar(lat: number, lng: number) {
    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${this.userLocation.lng},${this.userLocation.lat};${lng},${lat}?overview=full&geometries=geojson`;
    fetch(routeUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.routes && data.routes.length > 0) {
          const route = data.routes[0].geometry.coordinates;
          const latLngs = route.map((point: [number, number]) => [point[1], point[0]]);
          L.polyline(latLngs, { color: 'blue', weight: 5 }).addTo(this.map);
        }
      })
      .catch(error => console.error('Error fetching route data:', error));
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

        // Vérifiez si la position choisie est dans le cercle
      this.checkDropOffLocation({ lat, lng });
    });
  }

  checkDropOffLocation(selectedLocation: { lat: number, lng: number }) {
    // Définir un rayon de 500m (0.5 km)
    const radius = 0.5; // en kilomètres


    // Vérifier si la position choisie par l'utilisateur est dans un des cercles de dépôt des voitures
    let isLocationValid = false;


    for (let car of this.cars) {
      // Position de dépôt de la voiture
      const dropOffLatLng = car.pik_off_position;


      // Calculer la distance entre la position choisie et la position de dépôt de la voiture
      const distance = this.calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        dropOffLatLng.lat,
        dropOffLatLng.lng
      );


      // Vérifier si la position choisie est à l'intérieur du cercle de 500m autour de la zone de dépôt de la voiture
      if (distance <= radius) {
        isLocationValid = true;
        break; // Si une voiture correspond, on arrête la boucle
      }
    }


    if (isLocationValid) {
      console.log("La position choisie est valide !");
      this.inValidMessage ="";
      // Continuer le processus, par exemple, afficher les informations de réservation
    } else {
      this.inValidMessage =" The chosen location is not in a valid drop-off zone.";
      this.cancelDropOffLocationSelection();
    }
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

  pricingOption: string = '';
  reservationId: number | null = null;


  goPay() {
    if (this.authService.isLoggedIn() === false) {
      this.loadingService.openLoadingPageAndNavigate('/loRe', 1700);
    } else if (this.reservationId) {
      this.loadingService.openLoadingPageAndNavigate(`/user/pay/${this.reservationId}/${this.pricingOption}`, 1700);
    } 
  }

  goPay2() {
    if (this.authService.isLoggedIn() === false) {
      this.loadingService.openLoadingPageAndNavigate('/loRe', 1700);
    } else if (this.reservationId) {
      this.loadingService.openLoadingPageAndNavigate(`/user/pay/${this.reservationId}/${this.pricingOption}`, 1700);
    } 
  }

  
  apiUrl = 'http://localhost:5000/api/reservations'; // Remplacez par votre URL d'API


  // Handle reservation submission
  submitReservation(form: any) {
    if (form.valid) {
      const reservationPayload = {
        date_debut: this.pickupDate + 'T' + this.pickupTime + 'Z',
        date_fin: this.dropOffDate + 'T' + this.pickupTime + 'Z',
        user_id: this.userid, 
        voiture_id: this.selectedCarId,
        statut: true,
        avis: '',
        token_qr: '',
        pickup_location: '',
        dropoff_location: '',
      };
      this.http.post('http://localhost:5000/api/reservations', reservationPayload).subscribe(
        (response: any) => {
          console.log('Reservation response:', response);
          this.reservationId = response.reservation.reservation_id; // Capture the returned reservation ID
          this.sendNotification();
          this.goPay();
        },
        error => {
          console.error('Error during reservation submission:', error);
          alert('Error submitting reservation');
        }
      );
    } else {
      alert('Please fill out all fields and select a pricing option');
    }
  }

  // Send a notification after successful reservation
sendNotification() {
  // Fetch car details
  this.http.get(`http://localhost:5000/api/voitures/${this.selectedCarId}`).subscribe(
    (carResponse: any) => {
      const carDetails = carResponse; // Extract car details
      console.log('Car details:', carDetails);

      // Fetch user details
      this.http.get(`http://localhost:5000/api/user/${this.userid}`).subscribe(
        (userResponse: any) => {
          const userDetails = userResponse.user; // Extract user details
          console.log('User details:', userDetails);

          // Create the message to send
          const message = `${userDetails.nom} ${userDetails.prenom} has reserved a ${carDetails.marque} ${carDetails.modele}`;

          // Prepare notification payload
          const notificationPayload = {
            user_id: this.userid,
            message: message,
            read: false
          };

          // Send the notification
          this.http.post('http://localhost:5000/api/notifications', notificationPayload).subscribe(
            () => {
              console.log('Notification sent successfully');
            },
            error => {
              console.error('Error sending notification:', error);
            }
          );
        },
        error => {
          console.error('Error fetching user details:', error);
        }
      );
    },
    error => {
      console.error('Error fetching car details:', error);
    }
  );
}
 

}
