create database medical_scheduling;

use medical_scheduling;

create table roles(
	id int primary key auto_increment,
    role varchar(255) not null,
	created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null
);

insert into roles (id,role) values (1,"patient"), (2,"doctor"),(3,"admin");
    
create table permissions(
	id int primary key auto_increment,
    permission varchar(255) not null,
	created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null
);

create table role_has_permissions(
	id int primary key auto_increment, role_id int not null, permission_id int not null,
	created_at timestamp default current_timestamp not null, 
	updated_at timestamp default current_timestamp on update current_timestamp not null,
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
    city varchar(255) not null,
    address varchar(512) not null,
    password varchar(255) not null,
    role_id int not null,
    activation_token varchar(255) not null,
    is_active bool not null default false,
    is_deleted bool default false,
    token_created_at timestamp default current_timestamp not null,
    created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null,
    deleted_at timestamp,
    foreign key (role_id) references roles(id)
);

create table login_attempts(
	id int primary key auto_increment,
    user_id int not null,
    password varchar(255) not null,
	status bool not null, 
    created_at timestamp default current_timestamp not null,
    foreign key (user_id) references users(id)
);

create table profile_pictures(
	id int primary key auto_increment,
    profile_picture varchar(255),
    user_id int not null,
    created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null,
    foreign key (user_id) references users(id)
);

create table clinic_hospitals(
	id int primary key auto_increment,
    name varchar(255) not null,
    location varchar(255) not null,
    gst_no varchar(255) not null,
    city varchar(255) not null,
    pincode int not null,
	created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null
);

create table doctor_details(
	id int primary key auto_increment,
    doctor_id int not null,
    hospital_id int not null,
    qualification varchar(255) not null,
    consultancy_fees int not null,
    approved int not null default 0,
	created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null,
    foreign key (doctor_id) references users(id),
    foreign key (hospital_id) references clinic_hospitals(id)
);

create table specialities(
	id int primary key auto_increment,
    speciality varchar(255) not null,
    approved bool not null default 0,
	created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null
);

create table doctor_has_specialities(
	id int primary key auto_increment,
    doctor_id int not null,
    speciality_id int not null,
	created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null,
    foreign key (doctor_id) references users(id),
    foreign key (speciality_id) references specialities(id)
);

create table time_slots(
	id int primary key auto_increment,
    doctor_id int not null,
    date date not null,
    start_time time not null,
    end_time time not null,
    is_booked bool not null default false,
    is_deleted bool default false,
	created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null,
    deleted_at timestamp,
    foreign key (doctor_id) references users(id) 
);

create table slot_bookings(
	id int primary key auto_increment,
    slot_id int,
    patient_id int,
    booking_date date not null,
    is_deleted bool default false,
    is_canceled bool default false,
	created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null,
    deleted_at timestamp,
	foreign key (slot_id) references time_slots(id),
    foreign key (patient_id) references users(id)
);

create table prescriptions(
	id int primary key auto_increment,
    doctor_id int not null,
    patient_id int not null,
    prescription text not null,
    diagnoses varchar(512) not null,
    created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null,
	foreign key (doctor_id) references users(id),
    foreign key (patient_id) references users(id)
);

create table payments(
	id int primary key auto_increment,
    patient_id int not null,
    doctor_id int not null,
    slot_id int not null,
    payment_amount int not null,
    status varchar(255) not null,
    is_refunded bool not null default 0,
    created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null,
    foreign key (doctor_id) references users(id),
    foreign key (patient_id) references users(id),
    foreign key (slot_id) references time_slots(id)
);


create table rating_and_reviews(
	id int primary key auto_increment,
    patient_id int not null,
    doctor_id int not null,
    rating int not null,
    review varchar(255) not null,
    created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null,
    foreign key (doctor_id) references users(id),
    foreign key (patient_id) references users(id)
);

create table patient_details(
	id int primary key auto_increment,
    patient_id int not null,
    blood_group varchar(10) not null,
    medical_history varchar(255),
	created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null,
    foreign key (patient_id) references users(id)
);


CREATE TABLE states (
	id int primary key auto_increment,
	state varchar(255) not null,
	created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null
);

INSERT INTO `states` (id,state) VALUES (1,'ANDHRA PRADESH'),(2,'ASSAM'),(3,'ARUNACHAL PRADESH'),(4,'BIHAR'),(5,'GUJRAT'),(6,'HARYANA'),(7,'HIMACHAL PRADESH'),(8,'JAMMU & KASHMIR'),(9,'KARNATAKA'),(10,'KERALA'),(11,'MADHYA PRADESH'),(12,'MAHARASHTRA'),(13,'MANIPUR'),(14,'MEGHALAYA'),(15,'MIZORAM'),(16,'NAGALAND'),(17,'ORISSA'),(18,'PUNJAB'),(19,'RAJASTHAN'),(20,'SIKKIM'),(21,'TAMIL NADU'),(22,'TRIPURA'),(23,'UTTAR PRADESH'),(24,'WEST BENGAL'),(25,'DELHI'),(26,'GOA'),(27,'PONDICHERY'),(28,'LAKSHDWEEP'),(29,'DAMAN & DIU'),(30,'DADRA & NAGAR'),(31,'CHANDIGARH'),(32,'ANDAMAN & NICOBAR'),(33,'UTTARANCHAL'),(34,'JHARKHAND'),(35,'CHATTISGARH');

create table cities(
	id int primary key auto_increment,
    state_id int NOT NULL,
	city varchar(255) NOT NULL,
   created_at timestamp default current_timestamp not null,
	updated_at timestamp default current_timestamp on update current_timestamp not null,
    foreign key (state_id) references states(id)
);

INSERT INTO `cities` (id, city, state_id) VALUES 
(1,'North and Middle Andaman',32),(2,'South Andaman',32),(3,'Nicobar',32),(4,'Adilabad',1),
(5,'Anantapur',1),(6,'Chittoor',1),(7,'East Godavari',1),(8,'Guntur',1),(9,'Hyderabad',1),
(10,'Kadapa',1),(11,'Karimnagar',1),(12,'Khammam',1),(13,'Krishna',1),(14,'Kurnool',1),
(15,'Mahbubnagar',1),(16,'Medak',1),(17,'Nalgonda',1),(18,'Nellore',1),(19,'Nizamabad',1),
(20,'Prakasam',1),(21,'Rangareddi',1),(22,'Srikakulam',1),(23,'Vishakhapatnam',1),
(24,'Vizianagaram',1),(25,'Warangal',1),(26,'West Godavari',1),(27,'Anjaw',3),(28,'Changlang',3),
(29,'East Kameng',3),(30,'Lohit',3),(31,'Lower Subansiri',3),(32,'Papum Pare',3),(33,'Tirap',3),
(34,'Dibang Valley',3),(35,'Upper Subansiri',3),(36,'West Kameng',3),(37,'Barpeta',2),
(38,'Bongaigaon',2),(39,'Cachar',2),(40,'Darrang',2),(41,'Dhemaji',2),(42,'Dhubri',2),
(43,'Dibrugarh',2),(44,'Goalpara',2),(45,'Golaghat',2),(46,'Hailakandi',2),(47,'Jorhat',2),
(48,'Karbi Anglong',2),(49,'Karimganj',2),(50,'Kokrajhar',2),(51,'Lakhimpur',2),(52,'Marigaon',2),
(53,'Nagaon',2),(54,'Nalbari',2),(55,'North Cachar Hills',2),(56,'Sibsagar',2),(57,'Sonitpur',2),
(58,'Tinsukia',2),(59,'Araria',4),(60,'Aurangabad',4),(61,'Banka',4),(62,'Begusarai',4),
(63,'Bhagalpur',4),(64,'Bhojpur',4),(65,'Buxar',4),(66,'Darbhanga',4),(67,'Purba Champaran',4),
(68,'Gaya',4),(69,'Gopalganj',4),(70,'Jamui',4),(71,'Jehanabad',4),(72,'Khagaria',4),
(73,'Kishanganj',4),(74,'Kaimur',4),(75,'Katihar',4),(76,'Lakhisarai',4),(77,'Madhubani',4),
(78,'Munger',4),(79,'Madhepura',4),(80,'Muzaffarpur',4),(81,'Nalanda',4),(82,'Nawada',4),
(83,'Patna',4),(84,'Purnia',4),(85,'Rohtas',4),(86,'Saharsa',4),(87,'Samastipur',4),
(88,'Sheohar',4),(89,'Sheikhpura',4),(90,'Saran',4),(91,'Sitamarhi',4),(92,'Supaul',4),
(93,'Siwan',4),(94,'Vaishali',4),(95,'Pashchim Champaran',4),(96,'Diu',29),(97,'Daman',29),
(98,'Central Delhi',25),(99,'East Delhi',25),(100,'New Delhi',25),(101,'North Delhi',25),
(102,'North East Delhi',25),(103,'North West Delhi',25),(104,'South Delhi',25),
(105,'South West Delhi',25),(106,'West Delhi',25),(107,'North Goa',26),(108,'South Goa',26),
(109,'Ahmedabad',5),(110,'Amreli District',5),(111,'Anand',5),(112,'Banaskantha',5),
(113,'Bharuch',5),(114,'Bhavnagar',5),(115,'Dahod',5),(116,'The Dangs',5),(117,'Gandhinagar',5),
(118,'Jamnagar',5),(119,'Junagadh',5),(120,'Kutch',5),(121,'Kheda',5),(122,'Mehsana',5),
(123,'Narmada',5),(124,'Navsari',5),(125,'Patan',5),(126,'Panchmahal',5),(127,'Porbandar',5),
(128,'Rajkot',5),(129,'Sabarkantha',5),(130,'Surendranagar',5),(131,'Surat',5),(132,'Vadodara',5),
(133,'Valsad',5),(134,'Ambala',6),(135,'Bhiwani',6),(136,'Faridabad',6),(137,'Fatehabad',6),
(138,'Gurgaon',6),(139,'Hissar',6),(140,'Jhajjar',6),(141,'Jind',6),(142,'Karnal',6),
(143,'Kaithal',6),(144,'Kurukshetra',6),(145,'Mahendragarh',6),(146,'Mewat',6),(147,'Panchkula',6),
(148,'Panipat',6),(149,'Rewari',6),(150,'Rohtak',6),(151,'Sirsa',6),(152,'Sonepat',6),
(153,'Yamuna Nagar',6),(154,'Palwal',6),(155,'Bilaspur',7),(156,'Chamba',7),(157,'Hamirpur',7),
(158,'Kangra',7),(159,'Kinnaur',7),(160,'Kulu',7),(161,'Lahaul and Spiti',7),(162,'Mandi',7),
(163,'Shimla',7),(164,'Sirmaur',7),(165,'Solan',7),(166,'Una',7),(167,'Anantnag',8),
(168,'Badgam',8),(169,'Bandipore',8),(170,'Baramula',8),(171,'Doda',8),(172,'Jammu',8),
(173,'Kargil',8),(174,'Kathua',8),(175,'Kupwara',8),(176,'Leh',8),(177,'Poonch',8),
(178,'Pulwama',8),(179,'Rajauri',8),(180,'Srinagar',8),(181,'Samba',8),(182,'Udhampur',8),
(183,'Bokaro',34),(184,'Chatra',34),(185,'Deoghar',34),(186,'Dhanbad',34),(187,'Dumka',34),
(188,'Purba Singhbhum',34),(189,'Garhwa',34),(190,'Giridih',34),(191,'Godda',34),(192,'Gumla',34),
(193,'Hazaribagh',34),(194,'Koderma',34),(195,'Lohardaga',34),(196,'Pakur',34),(197,'Palamu',34),
(198,'Ranchi',34),(199,'Sahibganj',34),(200,'Seraikela and Kharsawan',34),
(201,'Pashchim Singhbhum',34),(202,'Ramgarh',34),(203,'Bidar',9),(204,'Belgaum',9),
(205,'Bijapur',9),(206,'Bagalkot',9),(207,'Bellary',9),(208,'Bangalore Rural District',9),
(209,'Bangalore Urban District',9),(210,'Chamarajnagar',9),(211,'Chikmagalur',9),
(212,'Chitradurga',9),(213,'Davanagere',9),(214,'Dharwad',9),(215,'Dakshina Kannada',9),
(216,'Gadag',9),(217,'Gulbarga',9),(218,'Hassan',9),(219,'Haveri District',9),(220,'Kodagu',9),
(221,'Kolar',9),(222,'Koppal',9),(223,'Mandya',9),(224,'Mysore',9),(225,'Raichur',9),
(226,'Shimoga',9),(227,'Tumkur',9),(228,'Udupi',9),(229,'Uttara Kannada',9),(230,'Ramanagara',9),
(231,'Chikballapur',9),(232,'Yadagiri',9),(233,'Alappuzha',10),(234,'Ernakulam',10),
(235,'Idukki',10),(236,'Kollam',10),(237,'Kannur',10),(238,'Kasaragod',10),(239,'Kottayam',10),
(240,'Kozhikode',10),(241,'Malappuram',10),(242,'Palakkad',10),(243,'Pathanamthitta',10),
(244,'Thrissur',10),(245,'Thiruvananthapuram',10),(246,'Wayanad',10),(247,'Alirajpur',11),
(248,'Anuppur',11),(249,'Ashok Nagar',11),(250,'Balaghat',11),(251,'Barwani',11),(252,'Betul',11),
(253,'Bhind',11),(254,'Bhopal',11),(255,'Burhanpur',11),(256,'Chhatarpur',11),(257,'Chhindwara',11),
(258,'Damoh',11),(259,'Datia',11),(260,'Dewas',11),(261,'Dhar',11),(262,'Dindori',11),(263,'Guna',11),
(264,'Gwalior',11),(265,'Harda',11),(266,'Hoshangabad',11),(267,'Indore',11),(268,'Jabalpur',11),
(269,'Jhabua',11),(270,'Katni',11),(271,'Khandwa',11),(272,'Khargone',11),(273,'Mandla',11),
(274,'Mandsaur',11),(275,'Morena',11),(276,'Narsinghpur',11),(277,'Neemuch',11),(278,'Panna',11),
(279,'Rewa',11),(280,'Rajgarh',11),(281,'Ratlam',11),(282,'Raisen',11),(283,'Sagar',11),(284,'Satna',11),
(285,'Sehore',11),(286,'Seoni',11),(287,'Shahdol',11),(288,'Shajapur',11),(289,'Sheopur',11),
(290,'Shivpuri',11),(291,'Sidhi',11),(292,'Singrauli',11),(293,'Tikamgarh',11),(294,'Ujjain',11),
(295,'Umaria',11),(296,'Vidisha',11),(297,'Ahmednagar',12),(298,'Akola',12),(299,'Amrawati',12),
(300,'Aurangabad',12),(301,'Bhandara',12),(302,'Beed',12),(303,'Buldhana',12),(304,'Chandrapur',12),
(305,'Dhule',12),(306,'Gadchiroli',12),(307,'Gondiya',12),(308,'Hingoli',12),(309,'Jalgaon',12),
(310,'Jalna',12),(311,'Kolhapur',12),(312,'Latur',12),(313,'Mumbai City',12),(314,'Mumbai suburban',12),
(315,'Nandurbar',12),(316,'Nanded',12),(317,'Nagpur',12),(318,'Nashik',12),(319,'Osmanabad',12),
(320,'Parbhani',12),(321,'Pune',12),(322,'Raigad',12),(323,'Ratnagiri',12),(324,'Sindhudurg',12),
(325,'Sangli',12),(326,'Solapur',12),(327,'Satara',12),(328,'Thane',12),(329,'Wardha',12),(330,'Washim',12),
(331,'Yavatmal',12),(332,'Bishnupur',13),(333,'Churachandpur',13),(334,'Chandel',13),(335,'Imphal East',13),
(336,'Senapati',13),(337,'Tamenglong',13),(338,'Thoubal',13),(339,'Ukhrul',13),(340,'Imphal West',13),
(341,'East Garo Hills',14),(342,'East Khasi Hills',14),(343,'Jaintia Hills',14),(344,'Ri-Bhoi',14),
(345,'South Garo Hills',14),(346,'West Garo Hills',14),(347,'West Khasi Hills',14),(348,'Aizawl',15),
(349,'Champhai',15),(350,'Kolasib',15),(351,'Lawngtlai',15),(352,'Lunglei',15),(353,'Mamit',15),
(354,'Saiha',15),(355,'Serchhip',15),(356,'Dimapur',16),(357,'Kohima',16),(358,'Mokokchung',16),
(359,'Mon',16),(360,'Phek',16),(361,'Tuensang',16),(362,'Wokha',16),(363,'Zunheboto',16),(364,'Angul',17),
(365,'Boudh',17),(366,'Bhadrak',17),(367,'Bolangir',17),(368,'Bargarh',17),(369,'Baleswar',17),
(370,'Cuttack',17),(371,'Debagarh',17),(372,'Dhenkanal',17),(373,'Ganjam',17),(374,'Gajapati',17),
(375,'Jharsuguda',17),(376,'Jajapur',17),(377,'Jagatsinghpur',17),(378,'Khordha',17),(379,'Kendujhar',17),
(380,'Kalahandi',17),(381,'Kandhamal',17),(382,'Koraput',17),(383,'Kendrapara',17),(384,'Malkangiri',17),
(385,'Mayurbhanj',17),(386,'Nabarangpur',17),(387,'Nuapada',17),(388,'Nayagarh',17),(389,'Puri',17),
(390,'Rayagada',17),(391,'Sambalpur',17),(392,'Subarnapur',17),(393,'Sundargarh',17),(394,'Karaikal',27),
(395,'Mahe',27),(396,'Puducherry',27),(397,'Yanam',27),(398,'Amritsar',18),(399,'Bathinda',18),
(400,'Firozpur',18),(401,'Faridkot',18),(402,'Fatehgarh Sahib',18),(403,'Gurdaspur',18),(404,'Hoshiarpur',18),
(405,'Jalandhar',18),(406,'Kapurthala',18),(407,'Ludhiana',18),(408,'Mansa',18),(409,'Moga',18),
(410,'Mukatsar',18),(411,'Nawan Shehar',18),(412,'Patiala',18),(413,'Rupnagar',18),(414,'Sangrur',18),
(415,'Ajmer',19),(416,'Alwar',19),(417,'Bikaner',19),(418,'Barmer',19),(419,'Banswara',19),
(420,'Bharatpur',19),(421,'Baran',19),(422,'Bundi',19),(423,'Bhilwara',19),(424,'Churu',19),
(425,'Chittorgarh',19),(426,'Dausa',19),(427,'Dholpur',19),(428,'Dungapur',19),(429,'Ganganagar',19),
(430,'Hanumangarh',19),(431,'Juhnjhunun',19),(432,'Jalore',19),(433,'Jodhpur',19),(434,'Jaipur',19),
(435,'Jaisalmer',19),(436,'Jhalawar',19),(437,'Karauli',19),(438,'Kota',19),(439,'Nagaur',19),(440,'Pali',19),
(441,'Pratapgarh',19),(442,'Rajsamand',19),(443,'Sikar',19),(444,'Sawai Madhopur',19),(445,'Sirohi',19),
(446,'Tonk',19),(447,'Udaipur',19),(448,'East Sikkim',20),(449,'North Sikkim',20),(450,'South Sikkim',20),
(451,'West Sikkim',20),(452,'Ariyalur',21),(453,'Chennai',21),(454,'Coimbatore',21),(455,'Cuddalore',21),
(456,'Dharmapuri',21),(457,'Dindigul',21),(458,'Erode',21),(459,'Kanchipuram',21),(460,'Kanyakumari',21),
(461,'Karur',21),(462,'Madurai',21),(463,'Nagapattinam',21),(464,'The Nilgiris',21),(465,'Namakkal',21),
(466,'Perambalur',21),(467,'Pudukkottai',21),(468,'Ramanathapuram',21),(469,'Salem',21),(470,'Sivagangai',21),
(471,'Tiruppur',21),(472,'Tiruchirappalli',21),(473,'Theni',21),(474,'Tirunelveli',21),(475,'Thanjavur',21),
(476,'Thoothukudi',21),(477,'Thiruvallur',21),(478,'Thiruvarur',21),(479,'Tiruvannamalai',21),
(480,'Vellore',21),(481,'Villupuram',21),(482,'Dhalai',22),(483,'North Tripura',22),(484,'South Tripura',22),
(485,'West Tripura',22),(486,'Almora',33),(487,'Bageshwar',33),(488,'Chamoli',33),(489,'Champawat',33),
(490,'Dehradun',33),(491,'Haridwar',33),(492,'Nainital',33),(493,'Pauri Garhwal',33),(494,'Pithoragharh',33),
(495,'Rudraprayag',33),(496,'Tehri Garhwal',33),(497,'Udham Singh Nagar',33),(498,'Uttarkashi',33),
(499,'Agra',23),(500,'Allahabad',23),(501,'Aligarh',23),(502,'Ambedkar Nagar',23),(503,'Auraiya',23),
(504,'Azamgarh',23),(505,'Barabanki',23),(506,'Badaun',23),(507,'Bagpat',23),(508,'Bahraich',23),
(509,'Bijnor',23),(510,'Ballia',23),(511,'Banda',23),(512,'Balrampur',23),(513,'Bareilly',23),
(514,'Basti',23),(515,'Bulandshahr',23),(516,'Chandauli',23),(517,'Chitrakoot',23),(518,'Deoria',23),
(519,'Etah',23),(520,'Kanshiram Nagar',23),(521,'Etawah',23),(522,'Firozabad',23),(523,'Farrukhabad',23),
(524,'Fatehpur',23),(525,'Faizabad',23),(526,'Gautam Buddha Nagar',23),(527,'Gonda',23),(528,'Ghazipur',23),
(529,'Gorkakhpur',23),(530,'Ghaziabad',23),(531,'Hamirpur',23),(532,'Hardoi',23),(533,'Mahamaya Nagar',23),
(534,'Jhansi',23),(535,'Jalaun',23),(536,'Jyotiba Phule Nagar',23),(537,'Jaunpur District',23),
(538,'Kanpur Dehat',23),(539,'Kannauj',23),(540,'Kanpur Nagar',23),(541,'Kaushambi',23),(542,'Kushinagar',23),
(543,'Lalitpur',23),(544,'Lakhimpur Kheri',23),(545,'Lucknow',23),(546,'Mau',23),(547,'Meerut',23),
(548,'Maharajganj',23),(549,'Mahoba',23),(550,'Mirzapur',23),(551,'Moradabad',23),(552,'Mainpuri',23),
(553,'Mathura',23),(554,'Muzaffarnagar',23),(555,'Pilibhit',23),(556,'Pratapgarh',23),(557,'Rampur',23),
(558,'Rae Bareli',23),(559,'Saharanpur',23),(560,'Sitapur',23),(561,'Shahjahanpur',23),
(562,'Sant Kabir Nagar',23),(563,'Siddharthnagar',23),(564,'Sonbhadra',23),(565,'Sant Ravidas Nagar',23),
(566,'Sultanpur',23),(567,'Shravasti',23),(568,'Unnao',23),(569,'Varanasi',23),(570,'Birbhum',24),
(571,'Bankura',24),(572,'Bardhaman',24),(573,'Darjeeling',24),(574,'Dakshin Dinajpur',24),(575,'Hooghly',24),
(576,'Howrah',24),(577,'Jalpaiguri',24),(578,'Cooch Behar',24),(579,'Kolkata',24),(580,'Malda',24),
(581,'Midnapore',24),(582,'Murshidabad',24),(583,'Nadia',24),(584,'North 24 Parganas',24),
(585,'South 24 Parganas',24),(586,'Purulia',24),(587,'Uttar Dinajpur',24);

