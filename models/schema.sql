

create database medical_scheduling;

use medical_scheduling;

create table roles(
	id int primary key auto_increment,
    role varchar(255) not null,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp
);



create table permissions(
	id int primary key auto_increment,
    permission varchar(255) not null,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp
);

create table role_has_permissions(
	id int primary key auto_increment, role_id int, permission_id int,
	created_at timestamp default current_timestamp, 
	updated_at timestamp default current_timestamp on update current_timestamp,
    foreign key (role_id) references roles(id), 
    foreign key (permission_id) references permissions(id)
); 

create table users(
	id int primary key auto_increment,
    fname varchar(255) not null,
    lname varchar(255) not null,
    email varchar(255) unique not null,
    gender varchar(50) not null,
    dob date not null,
    phone bigint not null,
    address varchar(512) not null,
    password varchar(255) not null,
    salt varchar(50) not null,
    role_id int,
    activation_token varchar(255) not null,
    is_active bool not null default false,
    profile varchar(255) ,
    is_deleted bool default false,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp,
    deleted_at timestamp,
    foreign key (role_id) references roles(id)
);

create table login_attempts(
	id int primary key auto_increment,
    user_id int,
	email varchar(255),
    password varchar(255),
	status bool not null, 
    attempts int,
    created_at timestamp default current_timestamp,
    foreign key (user_id) references users(id)
);
    
    
create table clinic_hospitals(
	id int primary key auto_increment,
    name varchar(255) not null,
    location varchar(255) not null,
    gst_no varchar(255) not null,
    city varchar(255) not null,
    pincode int not null,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp
);

create table doctor_details(
	id int primary key auto_increment,
    doctor_id int,
    hospital_id int,
    qualification varchar(255) not null,
    consultancy_fees int not null,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp,
    foreign key (doctor_id) references users(id),
    foreign key (hospital_id) references clinic_hospitals(id)
);

create table specialities(
	id int primary key auto_increment,
    speciality varchar(255) not null,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp
);

create table doctor_has_specialities(
	id int primary key auto_increment,
    doctor_id int,
    speciality_id int,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp,
    foreign key (doctor_id) references users(id),
    foreign key (speciality_id) references specialities(id)
);

create table time_slots(
	id int primary key auto_increment,
    doctor_id int,
    date date not null,
    start_time time not null,
    end_time time not null,
    is_booked bool not null default false,
    is_deleted bool default false,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp,
    deleted_at timestamp,
    foreign key (doctor_id) references users(id) 
);

create table slot_bookings(
	id int primary key auto_increment,
    slot_id int,
    patient_id int,
    booking_date date not null,
    is_deleted bool default false,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp,
    deleted_at timestamp,
	foreign key (slot_id) references time_slots(id),
    foreign key (patient_id) references users(id)
);

create table prescriptions(
	id int primary key auto_increment,
    doctor_id int,
    patient_id int,
    prescription varchar(1234) not null,
    diagnoses varchar(512) not null,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp,
	foreign key (doctor_id) references users(id),
    foreign key (patient_id) references users(id)
);

create table payments(
	id int primary key auto_increment,
    patient_id int,
    doctor_id int,
    slot_id int,
    payment_amount int not null,
    status varchar(255) not null,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp,
    foreign key (doctor_id) references users(id),
    foreign key (patient_id) references users(id),
    foreign key (slot_id) references time_slots(id)
);


create table rating_and_reviews(
	id int primary key auto_increment,
    patient_id int,
    doctor_id int,
    rating int not null,
    review varchar(255) not null,
    created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp,
    foreign key (doctor_id) references users(id),
    foreign key (patient_id) references users(id)
);

create table patient_details(
	id int primary key auto_increment,
    patient_id int,
    blood_group varchar(10) not null,
    medical_history varchar(255),
	created_at timestamp null default current_timestamp,
	updated_at timestamp null default current_timestamp on update current_timestamp,
    foreign key (patient_id) references users(id)
);