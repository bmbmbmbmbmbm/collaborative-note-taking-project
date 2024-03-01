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
-- Table structure for table `replies`
--

DROP TABLE IF EXISTS `replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `replies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reply` json NOT NULL,
  `replyTo` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `thread_id` int DEFAULT NULL,
  `created` datetime(6) NOT NULL,
  `entry_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `replies_ibfk_1` (`thread_id`),
  KEY `replies` (`entry_id`),
  CONSTRAINT `replies_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `threads` (`id`),
  CONSTRAINT `replies_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `replies_ibfk_3` FOREIGN KEY (`entry_id`) REFERENCES `entries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `replies`
--

LOCK TABLES `replies` WRITE;
/*!40000 ALTER TABLE `replies` DISABLE KEYS */;
INSERT INTO `replies` VALUES (10,'{\"content\": \"This is a reply\"}',NULL,1,1,'2022-07-28 17:24:53.000000',NULL),(11,'{\"content\": \"This is another reply\"}',NULL,1,1,'2022-07-28 17:24:58.000000',NULL),(12,'{\"content\": \"Another one\"}',NULL,1,1,'2022-07-28 17:25:01.000000',NULL),(13,'{\"content\": \"asdgasdg\"}',10,1,1,'2022-07-28 19:35:46.000000',NULL),(14,'{\"content\": \"asgfasdg\"}',NULL,1,NULL,'2022-07-28 21:08:59.000000',13),(15,'{\"content\": \"You can use the bath referencing guide https://library.bath.ac.uk/referencing/harvard-bath\"}',NULL,1,2,'2022-07-29 12:50:27.000000',NULL),(17,'{\"content\": \"Or you can use https://www.citethisforme.com/ using harvard bath referencing\"}',15,1,2,'2022-07-29 12:55:37.000000',NULL);
/*!40000 ALTER TABLE `replies` ENABLE KEYS */;
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
