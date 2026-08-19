import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentService } from '../services/student.service';
import { RoomService, Room } from '../services/room.service';
import { Dorm } from 'src/shared/models/student.interface';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

interface FloorGenderChoice {
  floor: number;
  gender: 'female' | 'male';
}

@Component({
  selector: 'app-dorm-structure',
  templateUrl: './dorm-structure.component.html',
  styleUrls: ['./dorm-structure.component.scss']
})
export class DormStructureComponent implements OnInit {
  dorms: Dorm[] = [];
  selectedDormId: number | null = null;

  floors = 1;
  roomsPerFloor = 10;
  capacity = 2;
  floorGenders: FloorGenderChoice[] = [];

  rooms: Room[] = [];
  isLoading = false;
  isGenerating = false;
  errorMessage: string | null = null;

  constructor(
    private studentService: StudentService,
    private roomService: RoomService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.studentService.getDorms().subscribe({
      next: (response) => this.dorms = response.dorms,
      error: (error) => console.error('Error fetching dorms', error)
    });
    this.rebuildFloorGenders();
  }

  onDormChange(): void {
    this.rooms = [];
    if (this.selectedDormId) {
      this.loadRooms();
    }
  }

  rebuildFloorGenders(): void {
    const n = Math.max(1, this.floors || 1);
    const existing = new Map(this.floorGenders.map(f => [f.floor, f.gender]));
    this.floorGenders = Array.from({ length: n }, (_, i) => ({
      floor: i + 1,
      gender: existing.get(i + 1) ?? 'female'
    }));
  }

  get mixedRoomCount(): number {
    return this.rooms.filter(r => !r.sex).length;
  }

  loadRooms(): void {
    if (!this.selectedDormId) return;
    this.isLoading = true;
    this.roomService.getRooms(this.selectedDormId).subscribe({
      next: (response) => {
        this.rooms = response.rooms;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching rooms', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load rooms.';
      }
    });
  }

  generateRooms(): void {
    if (!this.selectedDormId || this.isGenerating) return;

    if (this.rooms.length > 0) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          title: 'Add more rooms?',
          message: `This dorm already has ${this.rooms.length} room(s). Generating again ` +
            `will ADD ${this.floors * this.roomsPerFloor} new room(s) on top of the existing ` +
            `ones -- it will not replace or renumber them. Continue?`
        }
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.doGenerateRooms();
        }
      });
    } else {
      this.doGenerateRooms();
    }
  }

  private doGenerateRooms(): void {
    if (!this.selectedDormId) return;
    this.isGenerating = true;
    this.errorMessage = null;

    const floorGender: { [floor: string]: 'female' | 'male' } = {};
    this.floorGenders.forEach(f => floorGender[f.floor] = f.gender);

    this.roomService.bulkCreateRooms(this.selectedDormId, {
      floors: this.floors,
      rooms_per_floor: this.roomsPerFloor,
      capacity: this.capacity,
      floor_gender: floorGender
    }).subscribe({
      next: () => {
        this.isGenerating = false;
        this.loadRooms();
      },
      error: (error) => {
        console.error('Error generating rooms', error);
        this.isGenerating = false;
        this.errorMessage = 'Failed to generate rooms.';
      }
    });
  }

  saveRoom(room: Room): void {
    if (!this.selectedDormId) return;
    this.roomService.updateRoom(this.selectedDormId, room.id, {
      capacity: room.capacity, floor: room.floor ?? undefined, sex: room.sex ?? undefined
    }).subscribe({
      next: () => console.log('Room saved'),
      error: (error) => console.error('Error saving room', error)
    });
  }

  deleteRoom(room: Room): void {
    if (!this.selectedDormId) return;
    this.roomService.deleteRoom(this.selectedDormId, room.id).subscribe({
      next: () => this.rooms = this.rooms.filter(r => r.id !== room.id),
      error: (error) => console.error('Error deleting room', error)
    });
  }

  deleteAllRooms(): void {
    if (!this.selectedDormId || this.rooms.length === 0) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete ALL rooms in this dorm?',
        message: `This will permanently delete all ${this.rooms.length} room(s) for this ` +
          `dorm so you can start over. This cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed || !this.selectedDormId) return;
      this.errorMessage = null;
      this.roomService.deleteAllRooms(this.selectedDormId).subscribe({
        next: () => this.rooms = [],
        error: (error) => {
          console.error('Error deleting all rooms', error);
          this.errorMessage = error?.error?.error || 'Failed to delete all rooms.';
        }
      });
    });
  }
}
