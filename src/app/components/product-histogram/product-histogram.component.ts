import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { DataProviderService } from '../../services/data-provider.service';
import { Constants } from '../../utils';

@Component({
  selector: 'app-product-histogram',
  imports: [],
  templateUrl: './product-histogram.component.html',
  styleUrl: './product-histogram.component.css'
})
export class ProductHistogramComponent implements OnInit{
  public chart: any;

  id: string = 'productHistogram';

  @Input()
  data: number[] = [];

  @Input()
  labels: string[] = [];

  @Input()
  title: string = 'Title';

  @Input()
  xAxisLabel: string = 'X-Axis';

  @Input()
  yAxisLabel: string = 'Y-Axis';

  constructor(private dataProvider: DataProviderService) {
  }

  ngOnInit(): void {
    this.generateChart();
  }

  async generateChart() {
    if(Chart.getChart(this.id)) {
      Chart.getChart(this.id)?.destroy()
    }

    await this.sleep(100);

    this.chart = new Chart(this.id, {
      type: 'bar' as ChartType,
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.title,
            data: this.data,
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
            title: { display: true, text: this.xAxisLabel }
          },
          y: {
            title: { display: true, text: this.yAxisLabel },
            beginAtZero: true
          }
        }
      }
    });

  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}
