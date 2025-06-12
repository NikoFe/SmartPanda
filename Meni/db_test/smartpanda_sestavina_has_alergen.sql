CREATE DATABASE  IF NOT EXISTS `smartpanda` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `smartpanda`;
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
-- Table structure for table `sestavina_has_alergen`
--

DROP TABLE IF EXISTS `sestavina_has_alergen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sestavina_has_alergen` (
  `Sestavina_id` int NOT NULL,
  `Alergen_id` int NOT NULL,
  PRIMARY KEY (`Sestavina_id`,`Alergen_id`),
  KEY `fk_Sestavina_has_Alergen_Alergen1_idx` (`Alergen_id`),
  KEY `fk_Sestavina_has_Alergen_Sestavina1_idx` (`Sestavina_id`),
  CONSTRAINT `fk_Sestavina_has_Alergen_Alergen1` FOREIGN KEY (`Alergen_id`) REFERENCES `alergen` (`id`),
  CONSTRAINT `fk_Sestavina_has_Alergen_Sestavina1` FOREIGN KEY (`Sestavina_id`) REFERENCES `sestavina` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sestavina_has_alergen`
--

LOCK TABLES `sestavina_has_alergen` WRITE;
/*!40000 ALTER TABLE `sestavina_has_alergen` DISABLE KEYS */;
INSERT INTO `sestavina_has_alergen` VALUES (201,401),(202,402),(203,403);
/*!40000 ALTER TABLE `sestavina_has_alergen` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-15  8:46:24
