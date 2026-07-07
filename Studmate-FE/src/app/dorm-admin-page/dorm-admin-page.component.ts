import { Component } from '@angular/core';
import { RoommateRequestDetails } from 'src/shared/models/roommate.interface';
import { RoommateService } from '../services/roommate.service';

@Component({
  selector: 'app-dorm-admin-page',
  templateUrl: './dorm-admin-page.component.html',
  styleUrls: ['./dorm-admin-page.component.scss']
})
export class DormAdminPageComponent {
  roommateRequests: RoommateRequestDetails[] = [];

  constructor(private roommateService: RoommateService) { }

  ngOnInit(): void {
    this.roommateService.getAllRoommateRequests().subscribe((response) => {
      this.roommateRequests = response.requests;
      console.log(this.roommateRequests);
    });
  }

}
