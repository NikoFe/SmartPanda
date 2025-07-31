-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: smartpanda
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `jed`
--

DROP TABLE IF EXISTS `jed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jed` (
  `id` int NOT NULL,
  `ime` varchar(45) NOT NULL,
  `opis` varchar(45) NOT NULL,
  `zaloga` int DEFAULT NULL,
  `tip` varchar(30) DEFAULT NULL,
  `cena` decimal(3,0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jed`
--

LOCK TABLES `jed` WRITE;
/*!40000 ALTER TABLE `jed` DISABLE KEYS */;
INSERT INTO `jed` VALUES (1,'jed1','opis1',968,'vegansko',5),(2,'jed2','opis2',1978,'mesno',10),(3,'jed3','opis3',3000,'mesno',15);
/*!40000 ALTER TABLE `jed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jed_has_sestavina`
--

DROP TABLE IF EXISTS `jed_has_sestavina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jed_has_sestavina` (
  `jed_id` int NOT NULL,
  `sestavina_id` int NOT NULL,
  PRIMARY KEY (`jed_id`,`sestavina_id`),
  KEY `fk_jed_has_sestavina_sestavina1_idx` (`sestavina_id`),
  KEY `fk_jed_has_sestavina_jed_idx` (`jed_id`),
  CONSTRAINT `fk_jed_has_sestavina_jed` FOREIGN KEY (`jed_id`) REFERENCES `jed` (`id`),
  CONSTRAINT `fk_jed_has_sestavina_sestavina1` FOREIGN KEY (`sestavina_id`) REFERENCES `sestavina` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jed_has_sestavina`
--

LOCK TABLES `jed_has_sestavina` WRITE;
/*!40000 ALTER TABLE `jed_has_sestavina` DISABLE KEYS */;
INSERT INTO `jed_has_sestavina` VALUES (1,1001),(2,1001),(3,1001),(2,1002),(3,1002),(3,1003);
/*!40000 ALTER TABLE `jed_has_sestavina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sestavina`
--

DROP TABLE IF EXISTS `sestavina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sestavina` (
  `id` int NOT NULL,
  `ime` varchar(45) NOT NULL,
  `kalorije` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sestavina`
--

LOCK TABLES `sestavina` WRITE;
/*!40000 ALTER TABLE `sestavina` DISABLE KEYS */;
INSERT INTO `sestavina` VALUES (1001,'sest1',1),(1002,'sest2',2),(1003,'sest3',3);
/*!40000 ALTER TABLE `sestavina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uporabnik`
--

DROP TABLE IF EXISTS `uporabnik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uporabnik` (
  `id` int NOT NULL,
  `ime` varchar(45) NOT NULL,
  `lokacija` varchar(45) NOT NULL,
  `geslo` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uporabnik`
--

LOCK TABLES `uporabnik` WRITE;
/*!40000 ALTER TABLE `uporabnik` DISABLE KEYS */;
INSERT INTO `uporabnik` VALUES (1,'a','loc1','ap'),(2,'b','loc2','bp'),(3,'c','loc3','cp'),(36883,'d','loc4','dp');
/*!40000 ALTER TABLE `uporabnik` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uporabnik_has_jed`
--

DROP TABLE IF EXISTS `uporabnik_has_jed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uporabnik_has_jed` (
  `uporabnik_id` int NOT NULL,
  `jed_id` int NOT NULL,
  `kolicina` int DEFAULT NULL,
  `odobreno` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`uporabnik_id`,`jed_id`),
  KEY `jed_id` (`jed_id`),
  CONSTRAINT `uporabnik_has_jed_ibfk_1` FOREIGN KEY (`uporabnik_id`) REFERENCES `uporabnik` (`id`) ON DELETE CASCADE,
  CONSTRAINT `uporabnik_has_jed_ibfk_2` FOREIGN KEY (`jed_id`) REFERENCES `jed` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uporabnik_has_jed`
--

LOCK TABLES `uporabnik_has_jed` WRITE;
/*!40000 ALTER TABLE `uporabnik_has_jed` DISABLE KEYS */;
/*!40000 ALTER TABLE `uporabnik_has_jed` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-31 11:16:34
