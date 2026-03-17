import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket';
import { Status, Priority } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css'
})
export class TicketForm implements OnInit {
  ticketForm!: FormGroup;
  isEditMode = false;
  ticketId?: number;
  
  statusOptions = Object.values(Status);
  priorityOptions = Object.values(Priority);

  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: [Status.TODO, [Validators.required]],
      priority: [Priority.MEDIUM, [Validators.required]]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.ticketId = +params['id'];
        this.ticketService.getTicket(this.ticketId).subscribe(ticket => {
          this.ticketForm.patchValue(ticket);
        });
      }
    });
  }

  onSubmit() {
    if (this.ticketForm.invalid) return;

    const ticketData = this.ticketForm.value;

    if (this.isEditMode && this.ticketId) {
      this.ticketService.updateTicket(this.ticketId, ticketData).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.ticketService.createTicket(ticketData).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
