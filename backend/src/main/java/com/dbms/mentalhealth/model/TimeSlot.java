package com.dbms.mentalhealth.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "time_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "time_slot_id")
    private Integer timeSlotId;

    @ManyToMany
    @JoinTable(
            name = "admin_time_slot",
            joinColumns = @JoinColumn(name = "time_slot_id"),
            inverseJoinColumns = @JoinColumn(name = "admin_id")
    )
    private List<Admin> admins;  // The admin managing this time slot

    @Column(name = "date", nullable = false)
    private LocalDate date;  // Date for the time slot

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;  // Slot's start time

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;  // Slot's end time

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;  // Marks if the slot is available for booking

    @OneToMany(mappedBy = "timeSlot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments; // Appointment linked to this slot (optional)

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
