import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashborad',
  templateUrl: './dashborad.component.html',
  styleUrls: ['./dashborad.component.css']
})
export class DashboradComponent implements OnInit, AfterViewInit {
  private chartsInitialized = false;

  reservations: any[] = []; // To store reservations data
  users: any[] = []; // To store user data
  voitures: any[] = []; // To store cars data

  reservationCount = 0;
  userCount = 0;
  voitureCount = 0;

  chart: any; // To store the Chart.js instance

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getReservations();
    this.getUsers();
    this.getVoitures();
  }

  ngAfterViewInit(): void {
    if (!this.chartsInitialized) {
      this.initializeChart();
      this.chartsInitialized = true;
    }
  }

  // Fetch reservations
  getReservations(): void {
    this.http.get<any[]>('http://localhost:5000/api/reservations').subscribe(
      (data) => {
        this.reservations = data;
        this.reservationCount = data.length;
        console.log('Reservations fetched:', data);
        
        this.updateChart(); // Update chart data after fetching reservations
      },
      (error) => console.error('Error fetching reservations:', error)
    );
  }

  // Fetch users
  getUsers(): void {
    this.http.get<any>('http://localhost:5000/api/user').subscribe(
      (data) => {
        this.users = data.users || [];
        this.userCount = this.users.length;
        console.log('Users:', this.users);
      },
      (error) => console.error('Error fetching users:', error)
    );
  }

  // Fetch cars
  getVoitures(): void {
    this.http.get<any[]>('http://localhost:5000/api/voitures/').subscribe(
      (data) => {
        this.voitures = data;
        this.voitureCount = data.length;
        console.log('Voitures fetched:', data);
      },
      (error) => console.error('Error fetching voitures:', error)
    );
  }

  initializeChart() {
    const ctx = (document.getElementById('acquisitions') as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [], // We'll populate these dynamically
        datasets: [
          {
            label: 'Number of Reservations',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          }
        }
      }
    });
  }

  updateChart() {
    const monthlyData = this.aggregateReservationsByMonth();
    
    // Update the chart's data
    this.chart.data.labels = monthlyData.labels;
    this.chart.data.datasets[0].data = monthlyData.counts;
    this.chart.update();
  }

  aggregateReservationsByMonth() {
    const monthCounts: { [key: string]: number } = {};

    // Process reservations
    this.reservations.forEach(reservation => {
      const date = new Date(reservation.date_de_creation);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // Format as "YYYY-MM"
      if (!monthCounts[month]) {
        monthCounts[month] = 0;
      }
      monthCounts[month] += 1;
    });

    const labels = Object.keys(monthCounts).sort(); // Sort by date
    const counts = labels.map(label => monthCounts[label]);

    console.log('Monthly Data:', { labels, counts });
    
    return { labels, counts };
  }
}
