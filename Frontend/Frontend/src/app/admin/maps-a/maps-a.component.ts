import { Component, HostListener, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-maps-a',
  templateUrl: './maps-a.component.html',
  styleUrls: ['./maps-a.component.css']
})
export class MapsAComponent implements OnInit {
  map!: L.Map;
  dropOffMarker!: L.Marker | null;
  OfftLocationAddress: string = '';
  mapClickMode = false;
  dropOffLocation: string = '';
  InitAddress: string = '';

  showConfirmButton = false;  // Variable pour afficher le bouton de confirmation
  newPosition: { lat: number, lng: number } | null = null;  // Nouvelle position sélectionnée
  carIcon = L.icon({  // Définir l'icône pour les voitures
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4736/4736213.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  PositionIcon = L.icon({  // Définir l'icône pour la nouvelle position
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1088/1088372.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // Liste des voitures avec leurs positions
  cars: { name: string; position: { lat: number; lng: number }; pik_up_position: string; }[] = [];

  selectedCar: { name: string; position: { lat: number; lng: number } } | null = null;
  selectedCarName: string = '';

  ngOnInit(): void {
    this.initMap();
    this.fetchCars();  // Fetch car data from the backend
  }

  initMap() {
    // Initialisation de la carte
    this.map = L.map('map').setView([35.679, 10.124], 13);

    // Ajouter le fond de carte
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    // Gérer les clics sur la carte
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.mapClickMode) {
        this.mapClickMode = false;
        document.getElementById('map')?.classList.remove('map-select-cursor');
        this.handleMapClick(e.latlng.lat, e.latlng.lng);
      }
    });
  }

  // Fetch car data from the backend
  fetchCars() {
    fetch('http://localhost:5000/api/voitures/cars')
      .then(response => response.json())
      .then(data => {
        this.cars = data;
        this.cars.forEach(car => {
          this.geocodeCarLocation(car);  // Geocode each car's pick-up position
        });
      })
      .catch(error => console.error('Error fetching car data:', error));
  }

  // Geocode the car's pick-up position (pik_up_position)
  geocodeCarLocation(car: { name: string; pik_up_position: string; }) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${car.pik_up_position}`;
    
    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          
          // Add marker to map
          this.addCarMarker({ ...car, position: { lat, lng: lon } });
        }
      })
      .catch(error => console.error('Error geocoding car location:', error));
  }

  addCarMarker(car: { name: string; position: { lat: number; lng: number } }) {
    L.marker([car.position.lat, car.position.lng], { icon: this.carIcon })
      .addTo(this.map)
      .bindPopup(car.name)
      // Ajouter un événement de clic sur le marqueur de voiture
      .on('click', () => {
        this.selectCarFromMap(car);
      });
  }

  onCarSelect(event: any) {
    const selectedCarName = event.target.value;
    this.selectedCar = this.cars.find(car => car.name === selectedCarName) || null;

    if (this.selectedCar) {
      this.map.setView([this.selectedCar.position.lat, this.selectedCar.position.lng], 14);
      L.marker([this.selectedCar.position.lat, this.selectedCar.position.lng], { icon: this.carIcon })
        .addTo(this.map)
        .bindPopup(this.selectedCar.name)
        .openPopup();
      this.handleMapClick(this.selectedCar.position.lat, this.selectedCar.position.lng);
    }
  }

  selectCarFromMap(car: { name: string; position: { lat: number; lng: number } }) {
    this.selectedCar = car;
    this.selectedCarName = car.name;
    this.map.setView([car.position.lat, car.position.lng], 14);
    this.updateCarSelectionInDropdown(car.name);
    this.updateCarLocation(car.position);
  }

  updateCarSelectionInDropdown(carName: string) {
    const selectElement = document.getElementById('car-select') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = carName;  // Met à jour la sélection du menu déroulant
    }
  }

  updateCarLocation(position: { lat: number, lng: number }) {
    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`;
    fetch(reverseGeocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.address) {
          this.OfftLocationAddress = data.display_name;
          this.InitAddress = data.display_name;
          document.getElementById('dropoff-location')?.setAttribute('value', this.OfftLocationAddress);
        }
      })
      .catch(error => console.error('Error fetching reverse geocoding data:', error));
  }

  chooseDropOffLocationOnMap() {
    if (this.dropOffMarker) {
      return;  // Si un marqueur est déjà présent, ne rien faire
    }

    this.activateDropOffLocationSelection();

    this.map.once('click', (event: L.LeafletMouseEvent) => {
      this.cancelDropOffLocationSelection();

      const { lat, lng } = event.latlng;
      this.newPosition = { lat, lng };
      this.showConfirmButton = true;

      this.dropOffMarker = L.marker([lat, lng], { icon: this.PositionIcon })
        .addTo(this.map)
        .bindPopup('New location')
        .openPopup();

      this.handleMapClick(lat, lng);
    });
  }

  confirmChangePosition() {
    if (this.newPosition && this.selectedCar) {
      this.selectedCar.position = this.newPosition;
      this.showConfirmButton = false;
      this.newPosition = null;

      this.map.setView([this.selectedCar.position.lat, this.selectedCar.position.lng], 14);

      if (this.dropOffMarker) {
        this.dropOffMarker.remove();
        this.dropOffMarker = null;
      }

      L.marker([this.selectedCar.position.lat, this.selectedCar.position.lng], { icon: this.carIcon })
        .addTo(this.map)
        .bindPopup('New location for ' + this.selectedCar.name)
        .openPopup();
    }
  }

  activateDropOffLocationSelection() {
    this.mapClickMode = true;
    document.getElementById('map')?.classList.add('map-select-cursor');
  }

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
    this.showConfirmButton = false;
    this.newPosition = null;  // Clear the new position
    if (this.dropOffMarker) {
      this.dropOffMarker.remove();  // Remove the marker from the map
      this.dropOffMarker = null;    // Clear the marker reference
    }
  }

  // Handle the click event for map and reverse geocode the coordinates
  handleMapClick(lat: number, lng: number) {
    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    fetch(reverseGeocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.address) {
          this.OfftLocationAddress = data.display_name;
          document.getElementById('dropoff-location')?.setAttribute('value', this.OfftLocationAddress);
        }
      })
      .catch(error => console.error('Error fetching reverse geocoding data:', error));
  }

  private searchSubjectOff = new Subject<string>();

  constructor() {
    this.searchSubjectOff.pipe(debounceTime(1000)).subscribe(query => {
      if (query.length > 0) {
        this.geocodeOff(query);
      } else {
        this.resetDropOffLocation();
      }
    });
  }

  onSearchOff(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubjectOff.next(query); // Émet la valeur saisie
  }

  geocodeOff(query: string) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.dropOffLocation = data[0].display_name;
          this.map.setView([lat, lon], 14);

          this.newPosition = { lat, lng: lon };
          this.showConfirmButton = true;

          this.dropOffMarker = L.marker([lat, lon], { icon: this.PositionIcon })
            .addTo(this.map)
            .bindPopup('Nouvelle position')
            .openPopup();
        }
      })
      .catch(error => console.error('Error fetching geocoding data:', error));
  }
}
