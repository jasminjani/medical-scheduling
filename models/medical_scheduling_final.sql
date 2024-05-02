-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: medical_scheduling
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `state_id` int NOT NULL,
  `city` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `state_id` (`state_id`),
  CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=588 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clinic_hospitals`
--

DROP TABLE IF EXISTS `clinic_hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinic_hospitals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `gst_no` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `pincode` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contact_us`
--

DROP TABLE IF EXISTS `contact_us`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_us` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `mobile_no` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `city` varchar(45) NOT NULL,
  `role` varchar(45) NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `doctor_details`
--

DROP TABLE IF EXISTS `doctor_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `hospital_id` int NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `consultancy_fees` int NOT NULL,
  `approved` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `hospital_id` (`hospital_id`),
  CONSTRAINT `doctor_details_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`),
  CONSTRAINT `doctor_details_ibfk_2` FOREIGN KEY (`hospital_id`) REFERENCES `clinic_hospitals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `doctor_has_specialities`
--

DROP TABLE IF EXISTS `doctor_has_specialities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_has_specialities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `speciality_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `speciality_id` (`speciality_id`),
  CONSTRAINT `doctor_has_specialities_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`),
  CONSTRAINT `doctor_has_specialities_ibfk_2` FOREIGN KEY (`speciality_id`) REFERENCES `specialities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `login_attempts`
--

DROP TABLE IF EXISTS `login_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `login_attempts_ibfk_1` (`user_id`),
  CONSTRAINT `login_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `message` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `start_at` timestamp NULL DEFAULT NULL,
  `end_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patient_details`
--

DROP TABLE IF EXISTS `patient_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `blood_group` varchar(10) NOT NULL,
  `medical_history` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `patient_details_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `slot_id` int NOT NULL,
  `payment_amount` int NOT NULL,
  `status` varchar(255) NOT NULL,
  `is_refunded` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `patient_id` (`patient_id`),
  KEY `slot_id` (`slot_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`),
  CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`slot_id`) REFERENCES `time_slots` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permission` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `patient_id` int NOT NULL,
  `booking_id` int DEFAULT NULL,
  `prescription` text NOT NULL,
  `diagnoses` varchar(512) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `patient_id` (`patient_id`),
  KEY `fk_prescriptions_1_idx` (`booking_id`),
  CONSTRAINT `fk_prescriptions_1` FOREIGN KEY (`booking_id`) REFERENCES `slot_bookings` (`id`),
  CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`),
  CONSTRAINT `prescriptions_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `profile_pictures`
--

DROP TABLE IF EXISTS `profile_pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_pictures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profile_picture` varchar(255) DEFAULT NULL,
  `user_id` int NOT NULL,
  `is_active` tinyint DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `profile_pictures_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rating_and_reviews`
--

DROP TABLE IF EXISTS `rating_and_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating_and_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `rating` int NOT NULL,
  `review` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `rating_and_reviews_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`),
  CONSTRAINT `rating_and_reviews_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_has_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_has_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `role_has_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `slot_bookings`
--

DROP TABLE IF EXISTS `slot_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `slot_bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slot_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `booking_date` date NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `is_canceled` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `slot_id` (`slot_id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `slot_bookings_ibfk_1` FOREIGN KEY (`slot_id`) REFERENCES `time_slots` (`id`),
  CONSTRAINT `slot_bookings_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `specialities`
--

DROP TABLE IF EXISTS `specialities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `speciality` varchar(255) NOT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `states` (
  `id` int NOT NULL AUTO_INCREMENT,
  `state` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `time_slots`
--

DROP TABLE IF EXISTS `time_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_slots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `date` date NOT NULL,
  `start_time` timestamp NOT NULL,
  `end_time` timestamp NOT NULL,
  `is_booked` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `time_slots_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `dob` date NOT NULL,
  `phone` bigint NOT NULL,
  `city` varchar(255) NOT NULL,
  `address` varchar(512) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `activation_token` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `token_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_users_2_idx` (`role_id`),
  CONSTRAINT `fk_users_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,32,'North and Middle Andaman','2024-04-24 08:18:42','2024-04-24 08:18:42'),(2,32,'South Andaman','2024-04-24 08:18:42','2024-04-24 08:18:42'),(3,32,'Nicobar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(4,1,'Adilabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(5,1,'Anantapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(6,1,'Chittoor','2024-04-24 08:18:42','2024-04-24 08:18:42'),(7,1,'East Godavari','2024-04-24 08:18:42','2024-04-24 08:18:42'),(8,1,'Guntur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(9,1,'Hyderabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(10,1,'Kadapa','2024-04-24 08:18:42','2024-04-24 08:18:42'),(11,1,'Karimnagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(12,1,'Khammam','2024-04-24 08:18:42','2024-04-24 08:18:42'),(13,1,'Krishna','2024-04-24 08:18:42','2024-04-24 08:18:42'),(14,1,'Kurnool','2024-04-24 08:18:42','2024-04-24 08:18:42'),(15,1,'Mahbubnagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(16,1,'Medak','2024-04-24 08:18:42','2024-04-24 08:18:42'),(17,1,'Nalgonda','2024-04-24 08:18:42','2024-04-24 08:18:42'),(18,1,'Nellore','2024-04-24 08:18:42','2024-04-24 08:18:42'),(19,1,'Nizamabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(20,1,'Prakasam','2024-04-24 08:18:42','2024-04-24 08:18:42'),(21,1,'Rangareddi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(22,1,'Srikakulam','2024-04-24 08:18:42','2024-04-24 08:18:42'),(23,1,'Vishakhapatnam','2024-04-24 08:18:42','2024-04-24 08:18:42'),(24,1,'Vizianagaram','2024-04-24 08:18:42','2024-04-24 08:18:42'),(25,1,'Warangal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(26,1,'West Godavari','2024-04-24 08:18:42','2024-04-24 08:18:42'),(27,3,'Anjaw','2024-04-24 08:18:42','2024-04-24 08:18:42'),(28,3,'Changlang','2024-04-24 08:18:42','2024-04-24 08:18:42'),(29,3,'East Kameng','2024-04-24 08:18:42','2024-04-24 08:18:42'),(30,3,'Lohit','2024-04-24 08:18:42','2024-04-24 08:18:42'),(31,3,'Lower Subansiri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(32,3,'Papum Pare','2024-04-24 08:18:42','2024-04-24 08:18:42'),(33,3,'Tirap','2024-04-24 08:18:42','2024-04-24 08:18:42'),(34,3,'Dibang Valley','2024-04-24 08:18:42','2024-04-24 08:18:42'),(35,3,'Upper Subansiri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(36,3,'West Kameng','2024-04-24 08:18:42','2024-04-24 08:18:42'),(37,2,'Barpeta','2024-04-24 08:18:42','2024-04-24 08:18:42'),(38,2,'Bongaigaon','2024-04-24 08:18:42','2024-04-24 08:18:42'),(39,2,'Cachar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(40,2,'Darrang','2024-04-24 08:18:42','2024-04-24 08:18:42'),(41,2,'Dhemaji','2024-04-24 08:18:42','2024-04-24 08:18:42'),(42,2,'Dhubri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(43,2,'Dibrugarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(44,2,'Goalpara','2024-04-24 08:18:42','2024-04-24 08:18:42'),(45,2,'Golaghat','2024-04-24 08:18:42','2024-04-24 08:18:42'),(46,2,'Hailakandi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(47,2,'Jorhat','2024-04-24 08:18:42','2024-04-24 08:18:42'),(48,2,'Karbi Anglong','2024-04-24 08:18:42','2024-04-24 08:18:42'),(49,2,'Karimganj','2024-04-24 08:18:42','2024-04-24 08:18:42'),(50,2,'Kokrajhar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(51,2,'Lakhimpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(52,2,'Marigaon','2024-04-24 08:18:42','2024-04-24 08:18:42'),(53,2,'Nagaon','2024-04-24 08:18:42','2024-04-24 08:18:42'),(54,2,'Nalbari','2024-04-24 08:18:42','2024-04-24 08:18:42'),(55,2,'North Cachar Hills','2024-04-24 08:18:42','2024-04-24 08:18:42'),(56,2,'Sibsagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(57,2,'Sonitpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(58,2,'Tinsukia','2024-04-24 08:18:42','2024-04-24 08:18:42'),(59,4,'Araria','2024-04-24 08:18:42','2024-04-24 08:18:42'),(60,4,'Aurangabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(61,4,'Banka','2024-04-24 08:18:42','2024-04-24 08:18:42'),(62,4,'Begusarai','2024-04-24 08:18:42','2024-04-24 08:18:42'),(63,4,'Bhagalpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(64,4,'Bhojpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(65,4,'Buxar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(66,4,'Darbhanga','2024-04-24 08:18:42','2024-04-24 08:18:42'),(67,4,'Purba Champaran','2024-04-24 08:18:42','2024-04-24 08:18:42'),(68,4,'Gaya','2024-04-24 08:18:42','2024-04-24 08:18:42'),(69,4,'Gopalganj','2024-04-24 08:18:42','2024-04-24 08:18:42'),(70,4,'Jamui','2024-04-24 08:18:42','2024-04-24 08:18:42'),(71,4,'Jehanabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(72,4,'Khagaria','2024-04-24 08:18:42','2024-04-24 08:18:42'),(73,4,'Kishanganj','2024-04-24 08:18:42','2024-04-24 08:18:42'),(74,4,'Kaimur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(75,4,'Katihar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(76,4,'Lakhisarai','2024-04-24 08:18:42','2024-04-24 08:18:42'),(77,4,'Madhubani','2024-04-24 08:18:42','2024-04-24 08:18:42'),(78,4,'Munger','2024-04-24 08:18:42','2024-04-24 08:18:42'),(79,4,'Madhepura','2024-04-24 08:18:42','2024-04-24 08:18:42'),(80,4,'Muzaffarpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(81,4,'Nalanda','2024-04-24 08:18:42','2024-04-24 08:18:42'),(82,4,'Nawada','2024-04-24 08:18:42','2024-04-24 08:18:42'),(83,4,'Patna','2024-04-24 08:18:42','2024-04-24 08:18:42'),(84,4,'Purnia','2024-04-24 08:18:42','2024-04-24 08:18:42'),(85,4,'Rohtas','2024-04-24 08:18:42','2024-04-24 08:18:42'),(86,4,'Saharsa','2024-04-24 08:18:42','2024-04-24 08:18:42'),(87,4,'Samastipur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(88,4,'Sheohar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(89,4,'Sheikhpura','2024-04-24 08:18:42','2024-04-24 08:18:42'),(90,4,'Saran','2024-04-24 08:18:42','2024-04-24 08:18:42'),(91,4,'Sitamarhi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(92,4,'Supaul','2024-04-24 08:18:42','2024-04-24 08:18:42'),(93,4,'Siwan','2024-04-24 08:18:42','2024-04-24 08:18:42'),(94,4,'Vaishali','2024-04-24 08:18:42','2024-04-24 08:18:42'),(95,4,'Pashchim Champaran','2024-04-24 08:18:42','2024-04-24 08:18:42'),(96,29,'Diu','2024-04-24 08:18:42','2024-04-24 08:18:42'),(97,29,'Daman','2024-04-24 08:18:42','2024-04-24 08:18:42'),(98,25,'Central Delhi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(99,25,'East Delhi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(100,25,'New Delhi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(101,25,'North Delhi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(102,25,'North East Delhi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(103,25,'North West Delhi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(104,25,'South Delhi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(105,25,'South West Delhi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(106,25,'West Delhi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(107,26,'North Goa','2024-04-24 08:18:42','2024-04-24 08:18:42'),(108,26,'South Goa','2024-04-24 08:18:42','2024-04-24 08:18:42'),(109,5,'Ahmedabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(110,5,'Amreli District','2024-04-24 08:18:42','2024-04-24 08:18:42'),(111,5,'Anand','2024-04-24 08:18:42','2024-04-24 08:18:42'),(112,5,'Banaskantha','2024-04-24 08:18:42','2024-04-24 08:18:42'),(113,5,'Bharuch','2024-04-24 08:18:42','2024-04-24 08:18:42'),(114,5,'Bhavnagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(115,5,'Dahod','2024-04-24 08:18:42','2024-04-24 08:18:42'),(116,5,'The Dangs','2024-04-24 08:18:42','2024-04-24 08:18:42'),(117,5,'Gandhinagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(118,5,'Jamnagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(119,5,'Junagadh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(120,5,'Kutch','2024-04-24 08:18:42','2024-04-24 08:18:42'),(121,5,'Kheda','2024-04-24 08:18:42','2024-04-24 08:18:42'),(122,5,'Mehsana','2024-04-24 08:18:42','2024-04-24 08:18:42'),(123,5,'Narmada','2024-04-24 08:18:42','2024-04-24 08:18:42'),(124,5,'Navsari','2024-04-24 08:18:42','2024-04-24 08:18:42'),(125,5,'Patan','2024-04-24 08:18:42','2024-04-24 08:18:42'),(126,5,'Panchmahal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(127,5,'Porbandar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(128,5,'Rajkot','2024-04-24 08:18:42','2024-04-24 08:18:42'),(129,5,'Sabarkantha','2024-04-24 08:18:42','2024-04-24 08:18:42'),(130,5,'Surendranagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(131,5,'Surat','2024-04-24 08:18:42','2024-04-24 08:18:42'),(132,5,'Vadodara','2024-04-24 08:18:42','2024-04-24 08:18:42'),(133,5,'Valsad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(134,6,'Ambala','2024-04-24 08:18:42','2024-04-24 08:18:42'),(135,6,'Bhiwani','2024-04-24 08:18:42','2024-04-24 08:18:42'),(136,6,'Faridabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(137,6,'Fatehabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(138,6,'Gurgaon','2024-04-24 08:18:42','2024-04-24 08:18:42'),(139,6,'Hissar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(140,6,'Jhajjar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(141,6,'Jind','2024-04-24 08:18:42','2024-04-24 08:18:42'),(142,6,'Karnal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(143,6,'Kaithal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(144,6,'Kurukshetra','2024-04-24 08:18:42','2024-04-24 08:18:42'),(145,6,'Mahendragarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(146,6,'Mewat','2024-04-24 08:18:42','2024-04-24 08:18:42'),(147,6,'Panchkula','2024-04-24 08:18:42','2024-04-24 08:18:42'),(148,6,'Panipat','2024-04-24 08:18:42','2024-04-24 08:18:42'),(149,6,'Rewari','2024-04-24 08:18:42','2024-04-24 08:18:42'),(150,6,'Rohtak','2024-04-24 08:18:42','2024-04-24 08:18:42'),(151,6,'Sirsa','2024-04-24 08:18:42','2024-04-24 08:18:42'),(152,6,'Sonepat','2024-04-24 08:18:42','2024-04-24 08:18:42'),(153,6,'Yamuna Nagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(154,6,'Palwal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(155,7,'Bilaspur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(156,7,'Chamba','2024-04-24 08:18:42','2024-04-24 08:18:42'),(157,7,'Hamirpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(158,7,'Kangra','2024-04-24 08:18:42','2024-04-24 08:18:42'),(159,7,'Kinnaur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(160,7,'Kulu','2024-04-24 08:18:42','2024-04-24 08:18:42'),(161,7,'Lahaul and Spiti','2024-04-24 08:18:42','2024-04-24 08:18:42'),(162,7,'Mandi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(163,7,'Shimla','2024-04-24 08:18:42','2024-04-24 08:18:42'),(164,7,'Sirmaur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(165,7,'Solan','2024-04-24 08:18:42','2024-04-24 08:18:42'),(166,7,'Una','2024-04-24 08:18:42','2024-04-24 08:18:42'),(167,8,'Anantnag','2024-04-24 08:18:42','2024-04-24 08:18:42'),(168,8,'Badgam','2024-04-24 08:18:42','2024-04-24 08:18:42'),(169,8,'Bandipore','2024-04-24 08:18:42','2024-04-24 08:18:42'),(170,8,'Baramula','2024-04-24 08:18:42','2024-04-24 08:18:42'),(171,8,'Doda','2024-04-24 08:18:42','2024-04-24 08:18:42'),(172,8,'Jammu','2024-04-24 08:18:42','2024-04-24 08:18:42'),(173,8,'Kargil','2024-04-24 08:18:42','2024-04-24 08:18:42'),(174,8,'Kathua','2024-04-24 08:18:42','2024-04-24 08:18:42'),(175,8,'Kupwara','2024-04-24 08:18:42','2024-04-24 08:18:42'),(176,8,'Leh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(177,8,'Poonch','2024-04-24 08:18:42','2024-04-24 08:18:42'),(178,8,'Pulwama','2024-04-24 08:18:42','2024-04-24 08:18:42'),(179,8,'Rajauri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(180,8,'Srinagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(181,8,'Samba','2024-04-24 08:18:42','2024-04-24 08:18:42'),(182,8,'Udhampur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(183,34,'Bokaro','2024-04-24 08:18:42','2024-04-24 08:18:42'),(184,34,'Chatra','2024-04-24 08:18:42','2024-04-24 08:18:42'),(185,34,'Deoghar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(186,34,'Dhanbad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(187,34,'Dumka','2024-04-24 08:18:42','2024-04-24 08:18:42'),(188,34,'Purba Singhbhum','2024-04-24 08:18:42','2024-04-24 08:18:42'),(189,34,'Garhwa','2024-04-24 08:18:42','2024-04-24 08:18:42'),(190,34,'Giridih','2024-04-24 08:18:42','2024-04-24 08:18:42'),(191,34,'Godda','2024-04-24 08:18:42','2024-04-24 08:18:42'),(192,34,'Gumla','2024-04-24 08:18:42','2024-04-24 08:18:42'),(193,34,'Hazaribagh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(194,34,'Koderma','2024-04-24 08:18:42','2024-04-24 08:18:42'),(195,34,'Lohardaga','2024-04-24 08:18:42','2024-04-24 08:18:42'),(196,34,'Pakur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(197,34,'Palamu','2024-04-24 08:18:42','2024-04-24 08:18:42'),(198,34,'Ranchi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(199,34,'Sahibganj','2024-04-24 08:18:42','2024-04-24 08:18:42'),(200,34,'Seraikela and Kharsawan','2024-04-24 08:18:42','2024-04-24 08:18:42'),(201,34,'Pashchim Singhbhum','2024-04-24 08:18:42','2024-04-24 08:18:42'),(202,34,'Ramgarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(203,9,'Bidar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(204,9,'Belgaum','2024-04-24 08:18:42','2024-04-24 08:18:42'),(205,9,'Bijapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(206,9,'Bagalkot','2024-04-24 08:18:42','2024-04-24 08:18:42'),(207,9,'Bellary','2024-04-24 08:18:42','2024-04-24 08:18:42'),(208,9,'Bangalore Rural District','2024-04-24 08:18:42','2024-04-24 08:18:42'),(209,9,'Bangalore Urban District','2024-04-24 08:18:42','2024-04-24 08:18:42'),(210,9,'Chamarajnagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(211,9,'Chikmagalur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(212,9,'Chitradurga','2024-04-24 08:18:42','2024-04-24 08:18:42'),(213,9,'Davanagere','2024-04-24 08:18:42','2024-04-24 08:18:42'),(214,9,'Dharwad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(215,9,'Dakshina Kannada','2024-04-24 08:18:42','2024-04-24 08:18:42'),(216,9,'Gadag','2024-04-24 08:18:42','2024-04-24 08:18:42'),(217,9,'Gulbarga','2024-04-24 08:18:42','2024-04-24 08:18:42'),(218,9,'Hassan','2024-04-24 08:18:42','2024-04-24 08:18:42'),(219,9,'Haveri District','2024-04-24 08:18:42','2024-04-24 08:18:42'),(220,9,'Kodagu','2024-04-24 08:18:42','2024-04-24 08:18:42'),(221,9,'Kolar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(222,9,'Koppal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(223,9,'Mandya','2024-04-24 08:18:42','2024-04-24 08:18:42'),(224,9,'Mysore','2024-04-24 08:18:42','2024-04-24 08:18:42'),(225,9,'Raichur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(226,9,'Shimoga','2024-04-24 08:18:42','2024-04-24 08:18:42'),(227,9,'Tumkur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(228,9,'Udupi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(229,9,'Uttara Kannada','2024-04-24 08:18:42','2024-04-24 08:18:42'),(230,9,'Ramanagara','2024-04-24 08:18:42','2024-04-24 08:18:42'),(231,9,'Chikballapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(232,9,'Yadagiri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(233,10,'Alappuzha','2024-04-24 08:18:42','2024-04-24 08:18:42'),(234,10,'Ernakulam','2024-04-24 08:18:42','2024-04-24 08:18:42'),(235,10,'Idukki','2024-04-24 08:18:42','2024-04-24 08:18:42'),(236,10,'Kollam','2024-04-24 08:18:42','2024-04-24 08:18:42'),(237,10,'Kannur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(238,10,'Kasaragod','2024-04-24 08:18:42','2024-04-24 08:18:42'),(239,10,'Kottayam','2024-04-24 08:18:42','2024-04-24 08:18:42'),(240,10,'Kozhikode','2024-04-24 08:18:42','2024-04-24 08:18:42'),(241,10,'Malappuram','2024-04-24 08:18:42','2024-04-24 08:18:42'),(242,10,'Palakkad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(243,10,'Pathanamthitta','2024-04-24 08:18:42','2024-04-24 08:18:42'),(244,10,'Thrissur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(245,10,'Thiruvananthapuram','2024-04-24 08:18:42','2024-04-24 08:18:42'),(246,10,'Wayanad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(247,11,'Alirajpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(248,11,'Anuppur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(249,11,'Ashok Nagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(250,11,'Balaghat','2024-04-24 08:18:42','2024-04-24 08:18:42'),(251,11,'Barwani','2024-04-24 08:18:42','2024-04-24 08:18:42'),(252,11,'Betul','2024-04-24 08:18:42','2024-04-24 08:18:42'),(253,11,'Bhind','2024-04-24 08:18:42','2024-04-24 08:18:42'),(254,11,'Bhopal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(255,11,'Burhanpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(256,11,'Chhatarpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(257,11,'Chhindwara','2024-04-24 08:18:42','2024-04-24 08:18:42'),(258,11,'Damoh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(259,11,'Datia','2024-04-24 08:18:42','2024-04-24 08:18:42'),(260,11,'Dewas','2024-04-24 08:18:42','2024-04-24 08:18:42'),(261,11,'Dhar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(262,11,'Dindori','2024-04-24 08:18:42','2024-04-24 08:18:42'),(263,11,'Guna','2024-04-24 08:18:42','2024-04-24 08:18:42'),(264,11,'Gwalior','2024-04-24 08:18:42','2024-04-24 08:18:42'),(265,11,'Harda','2024-04-24 08:18:42','2024-04-24 08:18:42'),(266,11,'Hoshangabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(267,11,'Indore','2024-04-24 08:18:42','2024-04-24 08:18:42'),(268,11,'Jabalpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(269,11,'Jhabua','2024-04-24 08:18:42','2024-04-24 08:18:42'),(270,11,'Katni','2024-04-24 08:18:42','2024-04-24 08:18:42'),(271,11,'Khandwa','2024-04-24 08:18:42','2024-04-24 08:18:42'),(272,11,'Khargone','2024-04-24 08:18:42','2024-04-24 08:18:42'),(273,11,'Mandla','2024-04-24 08:18:42','2024-04-24 08:18:42'),(274,11,'Mandsaur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(275,11,'Morena','2024-04-24 08:18:42','2024-04-24 08:18:42'),(276,11,'Narsinghpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(277,11,'Neemuch','2024-04-24 08:18:42','2024-04-24 08:18:42'),(278,11,'Panna','2024-04-24 08:18:42','2024-04-24 08:18:42'),(279,11,'Rewa','2024-04-24 08:18:42','2024-04-24 08:18:42'),(280,11,'Rajgarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(281,11,'Ratlam','2024-04-24 08:18:42','2024-04-24 08:18:42'),(282,11,'Raisen','2024-04-24 08:18:42','2024-04-24 08:18:42'),(283,11,'Sagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(284,11,'Satna','2024-04-24 08:18:42','2024-04-24 08:18:42'),(285,11,'Sehore','2024-04-24 08:18:42','2024-04-24 08:18:42'),(286,11,'Seoni','2024-04-24 08:18:42','2024-04-24 08:18:42'),(287,11,'Shahdol','2024-04-24 08:18:42','2024-04-24 08:18:42'),(288,11,'Shajapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(289,11,'Sheopur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(290,11,'Shivpuri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(291,11,'Sidhi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(292,11,'Singrauli','2024-04-24 08:18:42','2024-04-24 08:18:42'),(293,11,'Tikamgarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(294,11,'Ujjain','2024-04-24 08:18:42','2024-04-24 08:18:42'),(295,11,'Umaria','2024-04-24 08:18:42','2024-04-24 08:18:42'),(296,11,'Vidisha','2024-04-24 08:18:42','2024-04-24 08:18:42'),(297,12,'Ahmednagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(298,12,'Akola','2024-04-24 08:18:42','2024-04-24 08:18:42'),(299,12,'Amrawati','2024-04-24 08:18:42','2024-04-24 08:18:42'),(300,12,'Aurangabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(301,12,'Bhandara','2024-04-24 08:18:42','2024-04-24 08:18:42'),(302,12,'Beed','2024-04-24 08:18:42','2024-04-24 08:18:42'),(303,12,'Buldhana','2024-04-24 08:18:42','2024-04-24 08:18:42'),(304,12,'Chandrapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(305,12,'Dhule','2024-04-24 08:18:42','2024-04-24 08:18:42'),(306,12,'Gadchiroli','2024-04-24 08:18:42','2024-04-24 08:18:42'),(307,12,'Gondiya','2024-04-24 08:18:42','2024-04-24 08:18:42'),(308,12,'Hingoli','2024-04-24 08:18:42','2024-04-24 08:18:42'),(309,12,'Jalgaon','2024-04-24 08:18:42','2024-04-24 08:18:42'),(310,12,'Jalna','2024-04-24 08:18:42','2024-04-24 08:18:42'),(311,12,'Kolhapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(312,12,'Latur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(313,12,'Mumbai City','2024-04-24 08:18:42','2024-04-24 08:18:42'),(314,12,'Mumbai suburban','2024-04-24 08:18:42','2024-04-24 08:18:42'),(315,12,'Nandurbar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(316,12,'Nanded','2024-04-24 08:18:42','2024-04-24 08:18:42'),(317,12,'Nagpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(318,12,'Nashik','2024-04-24 08:18:42','2024-04-24 08:18:42'),(319,12,'Osmanabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(320,12,'Parbhani','2024-04-24 08:18:42','2024-04-24 08:18:42'),(321,12,'Pune','2024-04-24 08:18:42','2024-04-24 08:18:42'),(322,12,'Raigad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(323,12,'Ratnagiri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(324,12,'Sindhudurg','2024-04-24 08:18:42','2024-04-24 08:18:42'),(325,12,'Sangli','2024-04-24 08:18:42','2024-04-24 08:18:42'),(326,12,'Solapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(327,12,'Satara','2024-04-24 08:18:42','2024-04-24 08:18:42'),(328,12,'Thane','2024-04-24 08:18:42','2024-04-24 08:18:42'),(329,12,'Wardha','2024-04-24 08:18:42','2024-04-24 08:18:42'),(330,12,'Washim','2024-04-24 08:18:42','2024-04-24 08:18:42'),(331,12,'Yavatmal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(332,13,'Bishnupur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(333,13,'Churachandpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(334,13,'Chandel','2024-04-24 08:18:42','2024-04-24 08:18:42'),(335,13,'Imphal East','2024-04-24 08:18:42','2024-04-24 08:18:42'),(336,13,'Senapati','2024-04-24 08:18:42','2024-04-24 08:18:42'),(337,13,'Tamenglong','2024-04-24 08:18:42','2024-04-24 08:18:42'),(338,13,'Thoubal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(339,13,'Ukhrul','2024-04-24 08:18:42','2024-04-24 08:18:42'),(340,13,'Imphal West','2024-04-24 08:18:42','2024-04-24 08:18:42'),(341,14,'East Garo Hills','2024-04-24 08:18:42','2024-04-24 08:18:42'),(342,14,'East Khasi Hills','2024-04-24 08:18:42','2024-04-24 08:18:42'),(343,14,'Jaintia Hills','2024-04-24 08:18:42','2024-04-24 08:18:42'),(344,14,'Ri-Bhoi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(345,14,'South Garo Hills','2024-04-24 08:18:42','2024-04-24 08:18:42'),(346,14,'West Garo Hills','2024-04-24 08:18:42','2024-04-24 08:18:42'),(347,14,'West Khasi Hills','2024-04-24 08:18:42','2024-04-24 08:18:42'),(348,15,'Aizawl','2024-04-24 08:18:42','2024-04-24 08:18:42'),(349,15,'Champhai','2024-04-24 08:18:42','2024-04-24 08:18:42'),(350,15,'Kolasib','2024-04-24 08:18:42','2024-04-24 08:18:42'),(351,15,'Lawngtlai','2024-04-24 08:18:42','2024-04-24 08:18:42'),(352,15,'Lunglei','2024-04-24 08:18:42','2024-04-24 08:18:42'),(353,15,'Mamit','2024-04-24 08:18:42','2024-04-24 08:18:42'),(354,15,'Saiha','2024-04-24 08:18:42','2024-04-24 08:18:42'),(355,15,'Serchhip','2024-04-24 08:18:42','2024-04-24 08:18:42'),(356,16,'Dimapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(357,16,'Kohima','2024-04-24 08:18:42','2024-04-24 08:18:42'),(358,16,'Mokokchung','2024-04-24 08:18:42','2024-04-24 08:18:42'),(359,16,'Mon','2024-04-24 08:18:42','2024-04-24 08:18:42'),(360,16,'Phek','2024-04-24 08:18:42','2024-04-24 08:18:42'),(361,16,'Tuensang','2024-04-24 08:18:42','2024-04-24 08:18:42'),(362,16,'Wokha','2024-04-24 08:18:42','2024-04-24 08:18:42'),(363,16,'Zunheboto','2024-04-24 08:18:42','2024-04-24 08:18:42'),(364,17,'Angul','2024-04-24 08:18:42','2024-04-24 08:18:42'),(365,17,'Boudh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(366,17,'Bhadrak','2024-04-24 08:18:42','2024-04-24 08:18:42'),(367,17,'Bolangir','2024-04-24 08:18:42','2024-04-24 08:18:42'),(368,17,'Bargarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(369,17,'Baleswar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(370,17,'Cuttack','2024-04-24 08:18:42','2024-04-24 08:18:42'),(371,17,'Debagarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(372,17,'Dhenkanal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(373,17,'Ganjam','2024-04-24 08:18:42','2024-04-24 08:18:42'),(374,17,'Gajapati','2024-04-24 08:18:42','2024-04-24 08:18:42'),(375,17,'Jharsuguda','2024-04-24 08:18:42','2024-04-24 08:18:42'),(376,17,'Jajapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(377,17,'Jagatsinghpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(378,17,'Khordha','2024-04-24 08:18:42','2024-04-24 08:18:42'),(379,17,'Kendujhar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(380,17,'Kalahandi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(381,17,'Kandhamal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(382,17,'Koraput','2024-04-24 08:18:42','2024-04-24 08:18:42'),(383,17,'Kendrapara','2024-04-24 08:18:42','2024-04-24 08:18:42'),(384,17,'Malkangiri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(385,17,'Mayurbhanj','2024-04-24 08:18:42','2024-04-24 08:18:42'),(386,17,'Nabarangpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(387,17,'Nuapada','2024-04-24 08:18:42','2024-04-24 08:18:42'),(388,17,'Nayagarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(389,17,'Puri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(390,17,'Rayagada','2024-04-24 08:18:42','2024-04-24 08:18:42'),(391,17,'Sambalpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(392,17,'Subarnapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(393,17,'Sundargarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(394,27,'Karaikal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(395,27,'Mahe','2024-04-24 08:18:42','2024-04-24 08:18:42'),(396,27,'Puducherry','2024-04-24 08:18:42','2024-04-24 08:18:42'),(397,27,'Yanam','2024-04-24 08:18:42','2024-04-24 08:18:42'),(398,18,'Amritsar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(399,18,'Bathinda','2024-04-24 08:18:42','2024-04-24 08:18:42'),(400,18,'Firozpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(401,18,'Faridkot','2024-04-24 08:18:42','2024-04-24 08:18:42'),(402,18,'Fatehgarh Sahib','2024-04-24 08:18:42','2024-04-24 08:18:42'),(403,18,'Gurdaspur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(404,18,'Hoshiarpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(405,18,'Jalandhar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(406,18,'Kapurthala','2024-04-24 08:18:42','2024-04-24 08:18:42'),(407,18,'Ludhiana','2024-04-24 08:18:42','2024-04-24 08:18:42'),(408,18,'Mansa','2024-04-24 08:18:42','2024-04-24 08:18:42'),(409,18,'Moga','2024-04-24 08:18:42','2024-04-24 08:18:42'),(410,18,'Mukatsar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(411,18,'Nawan Shehar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(412,18,'Patiala','2024-04-24 08:18:42','2024-04-24 08:18:42'),(413,18,'Rupnagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(414,18,'Sangrur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(415,19,'Ajmer','2024-04-24 08:18:42','2024-04-24 08:18:42'),(416,19,'Alwar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(417,19,'Bikaner','2024-04-24 08:18:42','2024-04-24 08:18:42'),(418,19,'Barmer','2024-04-24 08:18:42','2024-04-24 08:18:42'),(419,19,'Banswara','2024-04-24 08:18:42','2024-04-24 08:18:42'),(420,19,'Bharatpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(421,19,'Baran','2024-04-24 08:18:42','2024-04-24 08:18:42'),(422,19,'Bundi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(423,19,'Bhilwara','2024-04-24 08:18:42','2024-04-24 08:18:42'),(424,19,'Churu','2024-04-24 08:18:42','2024-04-24 08:18:42'),(425,19,'Chittorgarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(426,19,'Dausa','2024-04-24 08:18:42','2024-04-24 08:18:42'),(427,19,'Dholpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(428,19,'Dungapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(429,19,'Ganganagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(430,19,'Hanumangarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(431,19,'Juhnjhunun','2024-04-24 08:18:42','2024-04-24 08:18:42'),(432,19,'Jalore','2024-04-24 08:18:42','2024-04-24 08:18:42'),(433,19,'Jodhpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(434,19,'Jaipur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(435,19,'Jaisalmer','2024-04-24 08:18:42','2024-04-24 08:18:42'),(436,19,'Jhalawar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(437,19,'Karauli','2024-04-24 08:18:42','2024-04-24 08:18:42'),(438,19,'Kota','2024-04-24 08:18:42','2024-04-24 08:18:42'),(439,19,'Nagaur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(440,19,'Pali','2024-04-24 08:18:42','2024-04-24 08:18:42'),(441,19,'Pratapgarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(442,19,'Rajsamand','2024-04-24 08:18:42','2024-04-24 08:18:42'),(443,19,'Sikar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(444,19,'Sawai Madhopur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(445,19,'Sirohi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(446,19,'Tonk','2024-04-24 08:18:42','2024-04-24 08:18:42'),(447,19,'Udaipur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(448,20,'East Sikkim','2024-04-24 08:18:42','2024-04-24 08:18:42'),(449,20,'North Sikkim','2024-04-24 08:18:42','2024-04-24 08:18:42'),(450,20,'South Sikkim','2024-04-24 08:18:42','2024-04-24 08:18:42'),(451,20,'West Sikkim','2024-04-24 08:18:42','2024-04-24 08:18:42'),(452,21,'Ariyalur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(453,21,'Chennai','2024-04-24 08:18:42','2024-04-24 08:18:42'),(454,21,'Coimbatore','2024-04-24 08:18:42','2024-04-24 08:18:42'),(455,21,'Cuddalore','2024-04-24 08:18:42','2024-04-24 08:18:42'),(456,21,'Dharmapuri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(457,21,'Dindigul','2024-04-24 08:18:42','2024-04-24 08:18:42'),(458,21,'Erode','2024-04-24 08:18:42','2024-04-24 08:18:42'),(459,21,'Kanchipuram','2024-04-24 08:18:42','2024-04-24 08:18:42'),(460,21,'Kanyakumari','2024-04-24 08:18:42','2024-04-24 08:18:42'),(461,21,'Karur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(462,21,'Madurai','2024-04-24 08:18:42','2024-04-24 08:18:42'),(463,21,'Nagapattinam','2024-04-24 08:18:42','2024-04-24 08:18:42'),(464,21,'The Nilgiris','2024-04-24 08:18:42','2024-04-24 08:18:42'),(465,21,'Namakkal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(466,21,'Perambalur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(467,21,'Pudukkottai','2024-04-24 08:18:42','2024-04-24 08:18:42'),(468,21,'Ramanathapuram','2024-04-24 08:18:42','2024-04-24 08:18:42'),(469,21,'Salem','2024-04-24 08:18:42','2024-04-24 08:18:42'),(470,21,'Sivagangai','2024-04-24 08:18:42','2024-04-24 08:18:42'),(471,21,'Tiruppur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(472,21,'Tiruchirappalli','2024-04-24 08:18:42','2024-04-24 08:18:42'),(473,21,'Theni','2024-04-24 08:18:42','2024-04-24 08:18:42'),(474,21,'Tirunelveli','2024-04-24 08:18:42','2024-04-24 08:18:42'),(475,21,'Thanjavur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(476,21,'Thoothukudi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(477,21,'Thiruvallur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(478,21,'Thiruvarur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(479,21,'Tiruvannamalai','2024-04-24 08:18:42','2024-04-24 08:18:42'),(480,21,'Vellore','2024-04-24 08:18:42','2024-04-24 08:18:42'),(481,21,'Villupuram','2024-04-24 08:18:42','2024-04-24 08:18:42'),(482,22,'Dhalai','2024-04-24 08:18:42','2024-04-24 08:18:42'),(483,22,'North Tripura','2024-04-24 08:18:42','2024-04-24 08:18:42'),(484,22,'South Tripura','2024-04-24 08:18:42','2024-04-24 08:18:42'),(485,22,'West Tripura','2024-04-24 08:18:42','2024-04-24 08:18:42'),(486,33,'Almora','2024-04-24 08:18:42','2024-04-24 08:18:42'),(487,33,'Bageshwar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(488,33,'Chamoli','2024-04-24 08:18:42','2024-04-24 08:18:42'),(489,33,'Champawat','2024-04-24 08:18:42','2024-04-24 08:18:42'),(490,33,'Dehradun','2024-04-24 08:18:42','2024-04-24 08:18:42'),(491,33,'Haridwar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(492,33,'Nainital','2024-04-24 08:18:42','2024-04-24 08:18:42'),(493,33,'Pauri Garhwal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(494,33,'Pithoragharh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(495,33,'Rudraprayag','2024-04-24 08:18:42','2024-04-24 08:18:42'),(496,33,'Tehri Garhwal','2024-04-24 08:18:42','2024-04-24 08:18:42'),(497,33,'Udham Singh Nagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(498,33,'Uttarkashi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(499,23,'Agra','2024-04-24 08:18:42','2024-04-24 08:18:42'),(500,23,'Allahabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(501,23,'Aligarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(502,23,'Ambedkar Nagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(503,23,'Auraiya','2024-04-24 08:18:42','2024-04-24 08:18:42'),(504,23,'Azamgarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(505,23,'Barabanki','2024-04-24 08:18:42','2024-04-24 08:18:42'),(506,23,'Badaun','2024-04-24 08:18:42','2024-04-24 08:18:42'),(507,23,'Bagpat','2024-04-24 08:18:42','2024-04-24 08:18:42'),(508,23,'Bahraich','2024-04-24 08:18:42','2024-04-24 08:18:42'),(509,23,'Bijnor','2024-04-24 08:18:42','2024-04-24 08:18:42'),(510,23,'Ballia','2024-04-24 08:18:42','2024-04-24 08:18:42'),(511,23,'Banda','2024-04-24 08:18:42','2024-04-24 08:18:42'),(512,23,'Balrampur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(513,23,'Bareilly','2024-04-24 08:18:42','2024-04-24 08:18:42'),(514,23,'Basti','2024-04-24 08:18:42','2024-04-24 08:18:42'),(515,23,'Bulandshahr','2024-04-24 08:18:42','2024-04-24 08:18:42'),(516,23,'Chandauli','2024-04-24 08:18:42','2024-04-24 08:18:42'),(517,23,'Chitrakoot','2024-04-24 08:18:42','2024-04-24 08:18:42'),(518,23,'Deoria','2024-04-24 08:18:42','2024-04-24 08:18:42'),(519,23,'Etah','2024-04-24 08:18:42','2024-04-24 08:18:42'),(520,23,'Kanshiram Nagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(521,23,'Etawah','2024-04-24 08:18:42','2024-04-24 08:18:42'),(522,23,'Firozabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(523,23,'Farrukhabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(524,23,'Fatehpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(525,23,'Faizabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(526,23,'Gautam Buddha Nagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(527,23,'Gonda','2024-04-24 08:18:42','2024-04-24 08:18:42'),(528,23,'Ghazipur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(529,23,'Gorkakhpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(530,23,'Ghaziabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(531,23,'Hamirpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(532,23,'Hardoi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(533,23,'Mahamaya Nagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(534,23,'Jhansi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(535,23,'Jalaun','2024-04-24 08:18:42','2024-04-24 08:18:42'),(536,23,'Jyotiba Phule Nagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(537,23,'Jaunpur District','2024-04-24 08:18:42','2024-04-24 08:18:42'),(538,23,'Kanpur Dehat','2024-04-24 08:18:42','2024-04-24 08:18:42'),(539,23,'Kannauj','2024-04-24 08:18:42','2024-04-24 08:18:42'),(540,23,'Kanpur Nagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(541,23,'Kaushambi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(542,23,'Kushinagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(543,23,'Lalitpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(544,23,'Lakhimpur Kheri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(545,23,'Lucknow','2024-04-24 08:18:42','2024-04-24 08:18:42'),(546,23,'Mau','2024-04-24 08:18:42','2024-04-24 08:18:42'),(547,23,'Meerut','2024-04-24 08:18:42','2024-04-24 08:18:42'),(548,23,'Maharajganj','2024-04-24 08:18:42','2024-04-24 08:18:42'),(549,23,'Mahoba','2024-04-24 08:18:42','2024-04-24 08:18:42'),(550,23,'Mirzapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(551,23,'Moradabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(552,23,'Mainpuri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(553,23,'Mathura','2024-04-24 08:18:42','2024-04-24 08:18:42'),(554,23,'Muzaffarnagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(555,23,'Pilibhit','2024-04-24 08:18:42','2024-04-24 08:18:42'),(556,23,'Pratapgarh','2024-04-24 08:18:42','2024-04-24 08:18:42'),(557,23,'Rampur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(558,23,'Rae Bareli','2024-04-24 08:18:42','2024-04-24 08:18:42'),(559,23,'Saharanpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(560,23,'Sitapur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(561,23,'Shahjahanpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(562,23,'Sant Kabir Nagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(563,23,'Siddharthnagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(564,23,'Sonbhadra','2024-04-24 08:18:42','2024-04-24 08:18:42'),(565,23,'Sant Ravidas Nagar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(566,23,'Sultanpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(567,23,'Shravasti','2024-04-24 08:18:42','2024-04-24 08:18:42'),(568,23,'Unnao','2024-04-24 08:18:42','2024-04-24 08:18:42'),(569,23,'Varanasi','2024-04-24 08:18:42','2024-04-24 08:18:42'),(570,24,'Birbhum','2024-04-24 08:18:42','2024-04-24 08:18:42'),(571,24,'Bankura','2024-04-24 08:18:42','2024-04-24 08:18:42'),(572,24,'Bardhaman','2024-04-24 08:18:42','2024-04-24 08:18:42'),(573,24,'Darjeeling','2024-04-24 08:18:42','2024-04-24 08:18:42'),(574,24,'Dakshin Dinajpur','2024-04-24 08:18:42','2024-04-24 08:18:42'),(575,24,'Hooghly','2024-04-24 08:18:42','2024-04-24 08:18:42'),(576,24,'Howrah','2024-04-24 08:18:42','2024-04-24 08:18:42'),(577,24,'Jalpaiguri','2024-04-24 08:18:42','2024-04-24 08:18:42'),(578,24,'Cooch Behar','2024-04-24 08:18:42','2024-04-24 08:18:42'),(579,24,'Kolkata','2024-04-24 08:18:42','2024-04-24 08:18:42'),(580,24,'Malda','2024-04-24 08:18:42','2024-04-24 08:18:42'),(581,24,'Midnapore','2024-04-24 08:18:42','2024-04-24 08:18:42'),(582,24,'Murshidabad','2024-04-24 08:18:42','2024-04-24 08:18:42'),(583,24,'Nadia','2024-04-24 08:18:42','2024-04-24 08:18:42'),(584,24,'North 24 Parganas','2024-04-24 08:18:42','2024-04-24 08:18:42'),(585,24,'South 24 Parganas','2024-04-24 08:18:42','2024-04-24 08:18:42'),(586,24,'Purulia','2024-04-24 08:18:42','2024-04-24 08:18:42'),(587,24,'Uttar Dinajpur','2024-04-24 08:18:42','2024-04-24 08:18:42');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


--
-- Dumping data for table `states`
--

LOCK TABLES `states` WRITE;
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
INSERT INTO `states` VALUES (1,'ANDHRA PRADESH','2024-05-02 11:45:21','2024-05-02 11:45:21'),(2,'ASSAM','2024-05-02 11:45:21','2024-05-02 11:45:21'),(3,'ARUNACHAL PRADESH','2024-05-02 11:45:21','2024-05-02 11:45:21'),(4,'BIHAR','2024-05-02 11:45:21','2024-05-02 11:45:21'),(5,'GUJRAT','2024-05-02 11:45:21','2024-05-02 11:45:21'),(6,'HARYANA','2024-05-02 11:45:21','2024-05-02 11:45:21'),(7,'HIMACHAL PRADESH','2024-05-02 11:45:21','2024-05-02 11:45:21'),(8,'JAMMU & KASHMIR','2024-05-02 11:45:21','2024-05-02 11:45:21'),(9,'KARNATAKA','2024-05-02 11:45:21','2024-05-02 11:45:21'),(10,'KERALA','2024-05-02 11:45:21','2024-05-02 11:45:21'),(11,'MADHYA PRADESH','2024-05-02 11:45:21','2024-05-02 11:45:21'),(12,'MAHARASHTRA','2024-05-02 11:45:21','2024-05-02 11:45:21'),(13,'MANIPUR','2024-05-02 11:45:21','2024-05-02 11:45:21'),(14,'MEGHALAYA','2024-05-02 11:45:21','2024-05-02 11:45:21'),(15,'MIZORAM','2024-05-02 11:45:21','2024-05-02 11:45:21'),(16,'NAGALAND','2024-05-02 11:45:21','2024-05-02 11:45:21'),(17,'ORISSA','2024-05-02 11:45:21','2024-05-02 11:45:21'),(18,'PUNJAB','2024-05-02 11:45:21','2024-05-02 11:45:21'),(19,'RAJASTHAN','2024-05-02 11:45:21','2024-05-02 11:45:21'),(20,'SIKKIM','2024-05-02 11:45:21','2024-05-02 11:45:21'),(21,'TAMIL NADU','2024-05-02 11:45:21','2024-05-02 11:45:21'),(22,'TRIPURA','2024-05-02 11:45:21','2024-05-02 11:45:21'),(23,'UTTAR PRADESH','2024-05-02 11:45:21','2024-05-02 11:45:21'),(24,'WEST BENGAL','2024-05-02 11:45:21','2024-05-02 11:45:21'),(25,'DELHI','2024-05-02 11:45:21','2024-05-02 11:45:21'),(26,'GOA','2024-05-02 11:45:21','2024-05-02 11:45:21'),(27,'PONDICHERY','2024-05-02 11:45:21','2024-05-02 11:45:21'),(28,'LAKSHDWEEP','2024-05-02 11:45:21','2024-05-02 11:45:21'),(29,'DAMAN & DIU','2024-05-02 11:45:21','2024-05-02 11:45:21'),(30,'DADRA & NAGAR','2024-05-02 11:45:21','2024-05-02 11:45:21'),(31,'CHANDIGARH','2024-05-02 11:45:21','2024-05-02 11:45:21'),(32,'ANDAMAN & NICOBAR','2024-05-02 11:45:21','2024-05-02 11:45:21'),(33,'UTTARANCHAL','2024-05-02 11:45:21','2024-05-02 11:45:21'),(34,'JHARKHAND','2024-05-02 11:45:21','2024-05-02 11:45:21'),(35,'CHATTISGARH','2024-05-02 11:45:21','2024-05-02 11:45:21');
/*!40000 ALTER TABLE `states` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'patient','2024-04-24 13:48:42','2024-04-24 13:49:06'),(2,'doctor','2024-04-24 13:48:42','2024-04-24 13:49:06'),(3,'admin','2024-04-24 13:48:42','2024-04-24 13:49:06');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `specialities`
--

LOCK TABLES `specialities` WRITE;
/*!40000 ALTER TABLE `specialities` DISABLE KEYS */;
INSERT INTO `specialities` VALUES (4,'Cardiology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(5,'Dermatology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(6,'Endocrinology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(7,'Gastroenterology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(8,'Hematology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(9,'Neurology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(10,'Oncology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(11,'Orthopedics',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(12,'Pediatrics',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(13,'Psychiatry',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(14,'Pulmonology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(15,'Rheumatology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(16,'Urology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(17,'Ophthalmology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(18,'Obstetrics & Gynecology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(19,'Nephrology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(20,'Emergency Medicine',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(21,'Family Medicine',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(22,'Anesthesiology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42'),(23,'Radiology',1,'2024-04-24 13:48:42','2024-04-24 13:48:42');
/*!40000 ALTER TABLE `specialities` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-02 13:11:21
