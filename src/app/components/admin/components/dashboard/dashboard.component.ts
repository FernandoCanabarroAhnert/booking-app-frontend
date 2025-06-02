import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IBookingDashboardSummary } from '../../../../interfaces/booking/booking-dashboard-summary.interface';
import { BookingService } from '../../../../services/booking.service';
import { AuthService } from '../../../../services/auth.service';
import { ApexOptions, NgApexchartsModule } from "ng-apexcharts";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  isAdmin: boolean = false;
  isOnlyOperator: boolean = false;
  operatorWorkingHotelId!: number;
  bookingDashboardSummary!: IBookingDashboardSummary;

  @ViewChild("chart") 
  chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  private readonly _bookingService = inject(BookingService);
  private readonly _authService = inject(AuthService);
  private readonly monthNames: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  ngOnInit(): void {
    this.isAdmin = AuthService.isAdmin();
    this.isOnlyOperator = AuthService.isOnlyOperator();
    if (this.isOnlyOperator) {
      this._authService.getMe().subscribe(response => {
        this.operatorWorkingHotelId = response.workingHotelId;
        this._bookingService.getDashboardSummary(response.workingHotelId).subscribe(response => {
          this.bookingDashboardSummary = response;
          this.initChart();
        });
      })
    }
    else this._bookingService.getDashboardSummary().subscribe(response => {
      this.bookingDashboardSummary = response;
      this.initChart();
    });
  }

  private initChart() {
    this.chartOptions = {
      series: [
        {
          name: "Quantidade de Reservas",
          data: this.bookingDashboardSummary.bookingStatsSummaries.map(stat => stat.bookingQuantity)
        },
        {
          name: "Quantidade de Hóspedes",
          data: this.bookingDashboardSummary.bookingStatsSummaries.map(stat => stat.guests)
        },
        {
          name: "Total Arrecadado (R$)",
          data: this.bookingDashboardSummary.bookingStatsSummaries.map(stat => stat.amount)
        }
      ],
      colors: ['#698167', '#a89172', '#a41e22'],
      chart: {
        height: 500,
        type: "line"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 5,
        curve: "straight",
        dashArray: [0, 8, 5]
      },
      title: {
        text: "Gráfico de Reservas 📈",
        align: "left",
        style: {
          fontSize: "32px",
          fontWeight: 100,
          fontFamily: "Helvetica, Arial, sans-serif"
        }
      },
      legend: {
        fontSize: "16px",
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false,
          style: {
            fontSize: '14px',
            colors: '#333'
          }
        },
        categories: this.bookingDashboardSummary.bookingStatsSummaries.map(stat => this.getMonthName(stat.month)),
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '14px',
            colors: '#333'
          }
        }
      },
      tooltip: {
        y: [
          {
            formatter: function (val: number) {
              return Math.round(val).toString();
            }
          },
          {
            formatter: function (val: number) {
              return Math.round(val).toString();
            }
          },
          {
            formatter: function (val: number) {
              return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(val * 1000);
            }
          }
        ]
      },
      grid: {
        borderColor: "#f1f1f1"
      }
    } as ChartOptions;
  }

  private getMonthName(value: number) {
      return this.monthNames[value - 1] || '';
  }

  

}
