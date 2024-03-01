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
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `code` varchar(8) NOT NULL,
  `title` varchar(120) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES ('CM10194','Computer systems architecture 1'),('CM10195','Computer systems architecture 2'),('CM10227','Principles of programming 1'),('CM10228','Principles of programming 2'),('CM10310','Artificial intelligence'),('CM10311','Discrete mathematics and databases'),('CM10312','Mathematics for computation'),('CM10313','Software processes and modelling'),('CM20217','Foundations of computation'),('CM20219','Fundamentals of visual computing'),('CM20254','Data structures and algorithms'),('CM20256','Functional programming'),('CM20314','Experimental systems project'),('CM20315','Machine learning'),('CM20316','Artificial intelligence 2'),('CM20317','Foundations and frontiers of machine learning'),('CM20318','Comparative programming languages'),('CM20319','Human-computer interaction and user experience'),('CM30070','Computer algebra'),('CM30072','Safety-critical computer systems'),('CM30073','Advanced algorithms & complexity'),('CM30075','Advanced computer graphics'),('CM30078','Networking'),('CM30080','Computer vision'),('CM30082','Individual project'),('CM30141','Theory of human computer interaction'),('CM30171','Compilers'),('CM30173','Cryptography'),('CM30174','Intelligent agents'),('CM30225','Parallel computing'),('CM30226','Logic and semantics of programming languages'),('CM40149','Collaborative systems'),('CM40178','Research project'),('CM40179','Entrepreneurship'),('CM50121','Safety critical systems'),('CM50123','Networking'),('CM50150','Interactive communication design'),('CM50200','Mobile and pervasive systems'),('CM50205','Theory of human computer interaction'),('CM50206','Intelligent agents'),('CM50209','Cybersecurity'),('CM50210','Cryptography'),('CM50264','Machine learning 1'),('EE40098','Computational intelligence'),('GENERAL','General Discussion'),('MA10207','Analysis 1'),('MA10209','Algebra 1A'),('MA10210','Algebra 1B'),('MA20216','Algebra 2A'),('MA20217','Algebra 2B'),('MA20218','Analysis 2A'),('MA20219','Analysis 2B'),('MA20222','Numerical analysis'),('MA30039','Differential geometry of curves & surfaces'),('MA30055','Introduction to topology'),('MA30087','Optimisation methods of operational research'),('MA30231','Projective geometry'),('MA30237','Group theory'),('MA30252','Advanced real analysis'),('MA40040','Algebraic topology'),('MA40042','Measure theory & integration'),('MA40050','Numerical optimisation and large-scale systems'),('MA40054','Representation theory of finite groups'),('MA40177','Scientific computing'),('MA40188','Algebraic curves	'),('MA40203','Theory of partial differential equations'),('MA40254','Differential and geometric analysis'),('MA40256','Analysis in Hilbert spaces'),('MN20074','Digital business innovation'),('MN30076','Business strategy'),('XX40211','Research project'),('XX50215','Statistics for data science');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
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
