package com.dbms.mentalhealth.model;

import com.dbms.mentalhealth.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Integer appointmentId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // The user booking the appointment

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;  // The admin providing the appointment

    @ManyToOne
    @JoinColumn(name = "time_slot_id", nullable = false)
    private TimeSlot timeSlot;  // The time slot linked to this appointment  // The time slot linked to this appointment

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AppointmentStatus status = AppointmentStatus.REQUESTED;  // Default status is REQUESTED

    @Column(name = "appointment_reason", length = 500)
    private String appointmentReason;  // Reason provided by the user (if any)

    @Column(name = "cancellation_reason")
    private String cancellationReason;  // Optional: Reason for cancellation (nullable)

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
