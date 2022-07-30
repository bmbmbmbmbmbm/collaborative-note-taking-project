-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: grady
-- ------------------------------------------------------
-- Server version	8.0.29

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
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `start` datetime(6) NOT NULL,
  `end` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `session_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES (1,1,'2022-07-14 19:43:24.000000',NULL),(2,1,'2022-07-15 14:36:04.000000',NULL),(3,1,'2022-07-15 16:30:47.000000',NULL),(4,1,'2022-07-15 17:36:25.000000',NULL),(5,1,'2022-07-16 13:45:55.000000',NULL),(6,1,'2022-07-20 10:52:57.000000',NULL),(7,1,'2022-07-20 10:58:16.000000',NULL),(8,1,'2022-07-20 12:40:39.000000',NULL),(9,1,'2022-07-22 15:34:51.000000',NULL),(10,1,'2022-07-23 13:48:07.000000',NULL),(11,1,'2022-07-25 13:51:35.000000',NULL),(12,1,'2022-07-25 15:08:32.000000',NULL),(13,1,'2022-07-25 17:12:18.000000',NULL),(14,1,'2022-07-26 12:39:14.000000',NULL),(15,1,'2022-07-26 18:37:01.000000',NULL),(16,1,'2022-07-26 18:37:29.000000',NULL),(17,1,'2022-07-26 18:39:40.000000',NULL),(18,1,'2022-07-26 18:42:17.000000',NULL),(19,1,'2022-07-26 18:45:27.000000',NULL),(20,1,'2022-07-27 13:11:55.000000',NULL),(21,1,'2022-07-28 11:32:01.000000',NULL),(22,1,'2022-07-28 13:50:25.000000',NULL),(23,1,'2022-07-28 14:27:33.000000',NULL),(24,1,'2022-07-28 14:36:43.000000',NULL),(25,1,'2022-07-28 14:37:19.000000',NULL),(26,1,'2022-07-28 14:41:17.000000',NULL),(27,1,'2022-07-28 14:42:14.000000',NULL),(28,1,'2022-07-28 14:43:26.000000',NULL),(29,1,'2022-07-28 14:45:49.000000',NULL),(30,1,'2022-07-28 15:17:05.000000',NULL),(31,1,'2022-07-28 17:07:35.000000',NULL),(32,1,'2022-07-28 19:13:04.000000',NULL),(33,1,'2022-07-28 19:35:22.000000',NULL),(34,1,'2022-07-28 20:48:27.000000',NULL),(35,1,'2022-07-28 21:06:21.000000',NULL),(36,1,'2022-07-28 21:27:18.000000',NULL),(37,1,'2022-07-29 12:36:17.000000',NULL),(38,1,'2022-07-29 13:11:23.000000',NULL),(39,1,'2022-07-29 14:48:45.000000',NULL),(40,1,'2022-07-29 17:58:02.000000',NULL),(41,1,'2022-07-29 21:13:27.000000',NULL),(42,1,'2022-07-29 21:32:33.000000',NULL),(43,1,'2022-07-29 21:42:17.000000',NULL),(44,1,'2022-07-29 21:44:37.000000',NULL),(45,1,'2022-07-29 21:45:25.000000',NULL),(46,1,'2022-07-29 21:52:46.000000',NULL),(47,1,'2022-07-29 21:55:53.000000',NULL),(48,1,'2022-07-29 22:16:31.000000',NULL),(49,1,'2022-07-29 22:17:11.000000',NULL),(50,1,'2022-07-29 22:32:08.000000',NULL),(51,1,'2022-07-29 22:38:08.000000',NULL),(52,1,'2022-07-29 22:42:13.000000',NULL),(53,1,'2022-07-29 22:43:03.000000',NULL),(54,1,'2022-07-29 22:47:01.000000',NULL),(55,1,'2022-07-29 22:49:39.000000',NULL),(56,1,'2022-07-29 22:50:42.000000',NULL),(57,1,'2022-07-29 22:52:28.000000',NULL),(58,1,'2022-07-29 22:53:30.000000',NULL),(59,1,'2022-07-29 22:54:27.000000',NULL),(60,1,'2022-07-29 22:55:18.000000',NULL);
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-30 13:54:36
