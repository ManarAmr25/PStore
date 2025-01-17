import { Component, OnInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { DataProviderService } from '../../../services/data-provider.service';
import { Constants } from '../../../utils';

@Component({
  selector: 'app-histogram',
  imports: [],
  templateUrl: './histogram.component.html',
  styleUrl: './histogram.component.css'
})
export class HistogramComponent implements OnInit{
  public chart: any;

  constructor(private dataProvider: DataProviderService) {
  }

  ngOnInit(): void {
    this.generateChart();
  }

  generateChart() {
    const ratingCounts = [0, 0, 0, 0, 0]; // 5 bars
    let reviews = this.dataProvider.getCurrentProductReviews();

    reviews.forEach((reviews) => {
      let score = Math.ceil(Math.max(Math.min(reviews.score,
                                               Constants.SCORE_UPPER_BOUND),
                             Constants.SCORE_LOWER_BOUND));
      ratingCounts[score - 1] += 1;
    });

    this.chart = new Chart('productHistogram', {
      type: 'bar' as ChartType,
      data: {
        labels: ['0-1', '1-2', '2-3', '3-4', '4-5'], // X-axis labels
        datasets: [
          {
            label: 'Product Rating Distribution',
            data: ratingCounts, // Frequencies
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar color
            borderColor: 'rgb(5, 120, 208)', // Border color
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: {
            title: { display: true, text: 'Rating Scores' }
          },
          y: {
            title: { display: true, text: 'Frequency' },
            beginAtZero: true
          }
        }
      }
    });
  }
}
