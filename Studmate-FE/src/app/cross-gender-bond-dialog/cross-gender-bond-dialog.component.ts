import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cross-gender-bond-dialog',
  templateUrl: './cross-gender-bond-dialog.component.html',
  styleUrls: ['./cross-gender-bond-dialog.component.scss']
})
export class CrossGenderBondDialogComponent {
  relationshipType = '';
  otherText = '';

  constructor(public dialogRef: MatDialogRef<CrossGenderBondDialogComponent>) { }

  get isValid(): boolean {
    if (!this.relationshipType) return false;
    return this.relationshipType !== 'Other' || this.otherText.trim().length > 0;
  }

  onConfirmClick(): void {
    if (!this.isValid) return;
    const value = this.relationshipType === 'Other' ? `Other: ${this.otherText.trim()}` : this.relationshipType;
    this.dialogRef.close(value);
  }

  onCancelClick(): void {
    this.dialogRef.close(null);
  }
}
