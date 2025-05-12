-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: billing_app
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add brand',7,'add_brand'),(26,'Can change brand',7,'change_brand'),(27,'Can delete brand',7,'delete_brand'),(28,'Can view brand',7,'view_brand'),(29,'Can add category',8,'add_category'),(30,'Can change category',8,'change_category'),(31,'Can delete category',8,'delete_category'),(32,'Can view category',8,'view_category'),(33,'Can add compdet',9,'add_compdet'),(34,'Can change compdet',9,'change_compdet'),(35,'Can delete compdet',9,'delete_compdet'),(36,'Can view compdet',9,'view_compdet'),(37,'Can add customer',10,'add_customer'),(38,'Can change customer',10,'change_customer'),(39,'Can delete customer',10,'delete_customer'),(40,'Can view customer',10,'view_customer'),(41,'Can add item',11,'add_item'),(42,'Can change item',11,'change_item'),(43,'Can delete item',11,'delete_item'),(44,'Can view item',11,'view_item'),(45,'Can add payment',12,'add_payment'),(46,'Can change payment',12,'change_payment'),(47,'Can delete payment',12,'delete_payment'),(48,'Can view payment',12,'view_payment'),(49,'Can add purchase',13,'add_purchase'),(50,'Can change purchase',13,'change_purchase'),(51,'Can delete purchase',13,'delete_purchase'),(52,'Can view purchase',13,'view_purchase'),(53,'Can add purchase bill',14,'add_purchasebill'),(54,'Can change purchase bill',14,'change_purchasebill'),(55,'Can delete purchase bill',14,'delete_purchasebill'),(56,'Can view purchase bill',14,'view_purchasebill'),(57,'Can add purchase payment',15,'add_purchasepayment'),(58,'Can change purchase payment',15,'change_purchasepayment'),(59,'Can delete purchase payment',15,'delete_purchasepayment'),(60,'Can view purchase payment',15,'view_purchasepayment'),(61,'Can add sale bill',16,'add_salebill'),(62,'Can change sale bill',16,'change_salebill'),(63,'Can delete sale bill',16,'delete_salebill'),(64,'Can view sale bill',16,'view_salebill'),(65,'Can add seller',17,'add_seller'),(66,'Can change seller',17,'change_seller'),(67,'Can delete seller',17,'delete_seller'),(68,'Can view seller',17,'view_seller'),(69,'Can add loan',18,'add_loan'),(70,'Can change loan',18,'change_loan'),(71,'Can delete loan',18,'delete_loan'),(72,'Can view loan',18,'view_loan'),(73,'Can add gl hist',19,'add_glhist'),(74,'Can change gl hist',19,'change_glhist'),(75,'Can delete gl hist',19,'delete_glhist'),(76,'Can view gl hist',19,'view_glhist'),(77,'Can add loan bill',20,'add_loanbill'),(78,'Can change loan bill',20,'change_loanbill'),(79,'Can delete loan bill',20,'delete_loanbill'),(80,'Can view loan bill',20,'view_loanbill'),(81,'Can add loan journal',21,'add_loanjournal'),(82,'Can change loan journal',21,'change_loanjournal'),(83,'Can delete loan journal',21,'delete_loanjournal'),(84,'Can view loan journal',21,'view_loanjournal'),(85,'Can add purchase item',22,'add_purchaseitem'),(86,'Can change purchase item',22,'change_purchaseitem'),(87,'Can delete purchase item',22,'delete_purchaseitem'),(88,'Can view purchase item',22,'view_purchaseitem'),(89,'Can add sale',23,'add_sale'),(90,'Can change sale',23,'change_sale'),(91,'Can delete sale',23,'delete_sale'),(92,'Can view sale',23,'view_sale'),(93,'Can add sale item',24,'add_saleitem'),(94,'Can change sale item',24,'change_saleitem'),(95,'Can delete sale item',24,'delete_saleitem'),(96,'Can view sale item',24,'view_saleitem'),(97,'Can add cash gl',25,'add_cashgl'),(98,'Can change cash gl',25,'change_cashgl'),(99,'Can delete cash gl',25,'delete_cashgl'),(100,'Can view cash gl',25,'view_cashgl'),(101,'Can add gl bal',26,'add_glbal'),(102,'Can change gl bal',26,'change_glbal'),(103,'Can delete gl bal',26,'delete_glbal'),(104,'Can view gl bal',26,'view_glbal'),(105,'Can add invest',27,'add_invest'),(106,'Can change invest',27,'change_invest'),(107,'Can delete invest',27,'delete_invest'),(108,'Can view invest',27,'view_invest'),(109,'Can add income',28,'add_income'),(110,'Can change income',28,'change_income'),(111,'Can delete income',28,'delete_income'),(112,'Can view income',28,'view_income');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$870000$yyVl5D8CSLj1AXYrWbzJOT$Zvddf48yPegBL+Z0VzqF42R++4e04cNWiZsnsNjaYpQ=',NULL,0,'Kavins','','','',0,1,'2025-05-02 05:12:02.560862');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_brand`
--

DROP TABLE IF EXISTS `billingmodule_brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_brand` (
  `brand_id` int NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  PRIMARY KEY (`brand_id`),
  UNIQUE KEY `BillingModule_brand_brand_name_61b51163_uniq` (`brand_name`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_brand`
--

LOCK TABLES `billingmodule_brand` WRITE;
/*!40000 ALTER TABLE `billingmodule_brand` DISABLE KEYS */;
INSERT INTO `billingmodule_brand` VALUES (1,'Nokia','Nokia'),(2,'Itel','Itel'),(3,'Motorola','Motorola'),(4,'Rose','Rose'),(5,'HMD','HMD'),(6,'LAVA','LAVA'),(8,'Voyx','Voyx'),(9,'MZ','MZ'),(10,'Compaq','Compaq'),(11,'UDM','UDM'),(13,'Evan','Evan'),(14,'Unix','Unix'),(15,'MXD','MXD'),(16,'Samsung','Samsung'),(17,'Xiaomi','Xiaomi'),(18,'Zebronics','Zebronics'),(19,'Mak power','Mak power'),(20,'Boat','Boat'),(21,'Jio','Jio'),(22,'Original','Original'),(23,'AM Diamond','AM Diamond'),(24,'Avinoc','Avinoc'),(25,'Vingajoy','Vingajoy'),(26,'Ruby','Ruby'),(27,'Treams','Treams'),(28,'BS power','BS power'),(29,'Ubon','Ubon'),(30,'Sandisk','Sandisk'),(31,'HP','HP'),(32,'Cross','Cross'),(33,'Morsim','Morsim'),(34,'Ycom','Ycom'),(35,'Lebon','Lebon'),(36,'Redmi','Redmi'),(37,'Oppo','Oppo'),(38,'Realme','Realme'),(39,'Vivo','Vivo'),(40,'OTG+USB','OTG+USB'),(41,'KDM','KDM'),(42,'Wasp feelers','Wasp feelers'),(43,'Bhajwad','Bhajwad'),(44,'ESD','ESD'),(45,'Meibo','Meibo'),(46,'Elite','Elite'),(47,'Super X','Super X'),(48,'HD pro','HD pro'),(49,'Plusclass','Plusclass'),(50,'G-Tel','G-Tel'),(51,'HD class','HD class'),(52,'Glass','Glass'),(53,'CRJ','CRJ'),(54,'POCO','POCO'),(55,'iFlip','iFlip');
/*!40000 ALTER TABLE `billingmodule_brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_cashgl`
--

DROP TABLE IF EXISTS `billingmodule_cashgl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_cashgl` (
  `seq_no` int NOT NULL AUTO_INCREMENT,
  `accno` varchar(30) NOT NULL,
  `date` date NOT NULL,
  `trans_amt` decimal(10,2) NOT NULL,
  `crdr` tinyint(1) NOT NULL,
  `trans_comt` longtext NOT NULL,
  `end_balance` decimal(10,2) NOT NULL,
  PRIMARY KEY (`seq_no`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_cashgl`
--

LOCK TABLES `billingmodule_cashgl` WRITE;
/*!40000 ALTER TABLE `billingmodule_cashgl` DISABLE KEYS */;
INSERT INTO `billingmodule_cashgl` VALUES (1,'CASH001','2025-05-10',15000.00,1,'Investment',15000.00),(2,'CASH001','2025-05-10',12500.00,1,'Sale BILL-2025-1 created, credited amount: 12500.00',27500.00),(3,'CASH001','2025-05-10',8500.00,0,'Loan Issued',19000.00),(4,'CASH001','2025-05-10',150.00,1,'Sale BILL-2025-2 created, credited amount: 150.00',19150.00),(5,'CASH001','2025-05-10',200.00,1,'Sale BILL-2025-3 created, credited amount: 200.00',19350.00),(6,'CASH001','2025-05-10',1600.00,1,'Sale BILL-2025-4 created, credited amount: 1600.00',20950.00),(7,'CASH001','2025-05-10',1100.00,0,'Loan Issued',19850.00),(8,'CASH001','2025-05-11',485.00,0,'Purchase PUR-2025-1 created, Debited amount: 485.00',19365.00),(9,'CASH001','2025-05-11',9800.00,0,'Purchase PUR-2025-2 created, Debited amount: 9800.00',9565.00),(10,'CASH001','2025-05-11',350.00,1,'Sale BILL-2025-5 created, credited amount: 350.00',9915.00),(11,'CASH001','2025-05-11',150.00,1,'Sale BILL-2025-6 created, credited amount: 150.00',10065.00),(12,'CASH001','2025-05-11',300.00,1,'Sale BILL-2025-7 created, credited amount: 300.00',10365.00),(13,'CASH001','2025-05-11',1150.00,1,'Sale BILL-2025-8 created, credited amount: 1150.00',11515.00),(14,'CASH001','2025-05-11',10600.00,1,'Sale BILL-2025-9 created, credited amount: 10600.00',22115.00),(15,'CASH001','2025-05-11',8100.00,0,'Loan Issued - Ramesh',14015.00),(16,'CASH001','2025-05-11',10600.00,1,'Sale BILL-2025-10 created, credited amount: 10600.00',24615.00),(17,'CASH001','2025-05-11',8100.00,0,'Loan Issued - Ramesh brother',16515.00);
/*!40000 ALTER TABLE `billingmodule_cashgl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_category`
--

DROP TABLE IF EXISTS `billingmodule_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `BillingModule_category_category_name_333ae2a1_uniq` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_category`
--

LOCK TABLES `billingmodule_category` WRITE;
/*!40000 ALTER TABLE `billingmodule_category` DISABLE KEYS */;
INSERT INTO `billingmodule_category` VALUES (1,'Button phone','Button phone'),(2,'Ear buds','Ear buds'),(3,'Bluetooth speaker','Bluetooth speaker'),(4,'Smart watch','Smart watch'),(5,'V8 Charger','V8 Charger'),(6,'Type-C Charger','Type-C Charger'),(7,'C pin adapter','C pin adapter'),(8,'Mi adapter','Mi adapter'),(9,'Mouse','Mouse'),(10,'Neck band','Neck band'),(11,'Battery','Battery'),(12,'Beard Trimmer','Beard Trimmer'),(13,'V8 Cable','V8 Cable'),(14,'Type-C cable','Type-C cable'),(15,'Multi pin Cable','Multi pin Cable'),(16,'Iphone cable','Iphone cable'),(18,'C to C cable','C to C cable'),(20,'Cable OTG','Cable OTG'),(21,'Pendrive','Pendrive'),(22,'Memory card','Memory card'),(23,'Power bank cable Type-C','Power bank cable Type-C'),(24,'Power bank cable V8','Power bank cable V8'),(25,'Power bank','Power bank'),(26,'Back case','Back case'),(27,'Flip case','Flip case'),(28,'Card reader','Card reader'),(29,'Headset','Headset'),(30,'Gaming gloves','Gaming gloves'),(31,'Car charger','Car charger'),(32,'Button Phone Charger','Button Phone Charger'),(33,'Tempered glass','Tempered glass'),(34,'Service','Service'),(36,'Aux cable','Aux cable'),(37,'Mobile','Mobile');
/*!40000 ALTER TABLE `billingmodule_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_compdet`
--

DROP TABLE IF EXISTS `billingmodule_compdet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_compdet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `logo_path` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_compdet`
--

LOCK TABLES `billingmodule_compdet` WRITE;
/*!40000 ALTER TABLE `billingmodule_compdet` DISABLE KEYS */;
INSERT INTO `billingmodule_compdet` VALUES (1,'/static/assets/logo.png');
/*!40000 ALTER TABLE `billingmodule_compdet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_customer`
--

DROP TABLE IF EXISTS `billingmodule_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_customer` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `mph` varchar(128) NOT NULL,
  `address` longtext NOT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_customer`
--

LOCK TABLES `billingmodule_customer` WRITE;
/*!40000 ALTER TABLE `billingmodule_customer` DISABLE KEYS */;
INSERT INTO `billingmodule_customer` VALUES (1,'Walkin customer','+919999999999','Idaikal','2025-05-03'),(2,'Mahesh (Sankar frnd)','+918508910937','Idaikal','2025-05-10'),(3,'Ramesh','+917826957479','Idaikal, karmi173','2025-05-11'),(4,'Ramesh brother','+919344729849','Idaikal, karmi174','2025-05-11');
/*!40000 ALTER TABLE `billingmodule_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_glbal`
--

DROP TABLE IF EXISTS `billingmodule_glbal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_glbal` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  `glac` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_glbal`
--

LOCK TABLES `billingmodule_glbal` WRITE;
/*!40000 ALTER TABLE `billingmodule_glbal` DISABLE KEYS */;
INSERT INTO `billingmodule_glbal` VALUES (1,'2025-05-10',19850.00,'CASH001'),(2,'2025-05-11',16515.00,'CASH001');
/*!40000 ALTER TABLE `billingmodule_glbal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_glhist`
--

DROP TABLE IF EXISTS `billingmodule_glhist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_glhist` (
  `trans_seq` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `trans_command` longtext NOT NULL,
  `credit` tinyint(1) NOT NULL,
  `debit` tinyint(1) NOT NULL,
  `trans_amount` decimal(10,2) NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  `loan_acc_id` varchar(15) NOT NULL,
  PRIMARY KEY (`trans_seq`),
  KEY `BillingModule_glhist_loan_acc_id_cba810e3_fk_BillingMo` (`loan_acc_id`),
  CONSTRAINT `BillingModule_glhist_loan_acc_id_cba810e3_fk_BillingMo` FOREIGN KEY (`loan_acc_id`) REFERENCES `billingmodule_loan` (`loan_accno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_glhist`
--

LOCK TABLES `billingmodule_glhist` WRITE;
/*!40000 ALTER TABLE `billingmodule_glhist` DISABLE KEYS */;
/*!40000 ALTER TABLE `billingmodule_glhist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_income`
--

DROP TABLE IF EXISTS `billingmodule_income`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_income` (
  `income_id` int NOT NULL AUTO_INCREMENT,
  `income_date` date NOT NULL,
  `income_amt` decimal(10,2) NOT NULL,
  `income_taken` tinyint(1) NOT NULL,
  `received_date` date DEFAULT NULL,
  `inctype` varchar(30) NOT NULL,
  PRIMARY KEY (`income_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_income`
--

LOCK TABLES `billingmodule_income` WRITE;
/*!40000 ALTER TABLE `billingmodule_income` DISABLE KEYS */;
INSERT INTO `billingmodule_income` VALUES (1,'2025-05-10',2500.00,0,NULL,'Mobile'),(2,'2025-05-10',875.00,0,NULL,'Accessories'),(3,'2025-05-11',805.00,0,NULL,'Accessories'),(4,'2025-05-11',5000.00,0,NULL,'Mobile');
/*!40000 ALTER TABLE `billingmodule_income` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_invest`
--

DROP TABLE IF EXISTS `billingmodule_invest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_invest` (
  `invest_id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `invest_amt` decimal(10,2) NOT NULL,
  `invest_desc` longtext NOT NULL,
  `source` longtext NOT NULL DEFAULT (_utf8mb3'0'),
  PRIMARY KEY (`invest_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_invest`
--

LOCK TABLES `billingmodule_invest` WRITE;
/*!40000 ALTER TABLE `billingmodule_invest` DISABLE KEYS */;
INSERT INTO `billingmodule_invest` VALUES (1,'2025-05-10',15000.00,'Investment','Old investment');
/*!40000 ALTER TABLE `billingmodule_invest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_item`
--

DROP TABLE IF EXISTS `billingmodule_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_item` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `min_stock` int NOT NULL,
  `purchase_price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) NOT NULL,
  `tax_option` varchar(50) DEFAULT NULL,
  `mrp` decimal(10,2) NOT NULL,
  `discount_type` varchar(50) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `stock_date` date NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=182 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_item`
--

LOCK TABLES `billingmodule_item` WRITE;
/*!40000 ALTER TABLE `billingmodule_item` DISABLE KEYS */;
INSERT INTO `billingmodule_item` VALUES (1,'Nokia 106','Button phone','Nokia',1,1,1480.00,1899.00,NULL,1899.00,NULL,0.00,'2025-05-02'),(2,'Nokia 110','Button phone','Nokia',1,1,1640.00,2099.00,NULL,2099.00,NULL,0.00,'2025-05-02'),(3,'Nokia 130 bigscreen','Button phone','Nokia',1,1,1780.00,2199.00,NULL,2199.00,NULL,0.00,'2025-05-02'),(4,'Itel Power 450','Button phone','Itel',1,1,1310.00,1899.00,NULL,1899.00,NULL,0.00,'2025-05-02'),(5,'Itel Muzik 430','Button phone','Itel',1,1,1480.00,1899.00,NULL,1899.00,NULL,0.00,'2025-05-02'),(6,'Itel 2175P','Button phone','Itel',1,1,950.00,1399.00,NULL,1399.00,NULL,0.00,'2025-05-02'),(7,'Itel 2165S','Button phone','Itel',1,1,850.00,1349.00,NULL,1349.00,NULL,0.00,'2025-05-02'),(8,'Moto a 10v','Button phone','Motorola',0,1,1170.00,1550.00,NULL,1550.00,NULL,0.00,'2025-05-02'),(9,'Rose 313','Button phone','Rose',1,1,600.00,999.00,NULL,999.00,NULL,0.00,'2025-05-02'),(10,'HMD 110','Button phone','HMD',1,1,1150.00,1799.00,NULL,1799.00,NULL,0.00,'2025-05-02'),(11,'HMD 105','Button phone','HMD',1,1,950.00,1499.00,NULL,1499.00,NULL,0.00,'2025-05-02'),(12,'HMD 105 4G','Button phone','HMD',1,1,1900.00,2499.00,NULL,2499.00,NULL,0.00,'2025-05-02'),(13,'Hero 2025 800','Button phone','LAVA',0,1,800.00,1199.00,NULL,1199.00,NULL,0.00,'2025-05-02'),(14,'Lava A1 Vibe','Button phone','LAVA',1,1,1000.00,1499.00,NULL,1499.00,NULL,0.00,'2025-05-02'),(15,'Lava A7 Torch','Button phone','LAVA',1,1,1410.00,1899.00,NULL,1899.00,NULL,0.00,'2025-05-02'),(16,'Lava A1 Josh 2024','Button phone','LAVA',2,1,900.00,1399.00,NULL,1399.00,NULL,0.00,'2025-05-02'),(17,'Lava A5 2023','Button phone','LAVA',1,1,1150.00,1699.00,NULL,1699.00,NULL,0.00,'2025-05-02'),(18,'Boat Airdopes 131','Ear buds','Boat',2,1,850.00,1450.00,NULL,2989.00,NULL,0.00,'2025-05-02'),(19,'Boat Airdopes 148','Ear buds','Boat',0,1,990.00,1600.00,NULL,4489.00,NULL,0.00,'2025-05-02'),(20,'Monk','Ear buds','Voyx',1,1,430.00,850.00,NULL,2999.00,NULL,0.00,'2025-05-02'),(21,'M29VP','Bluetooth speaker','MZ',1,1,250.00,479.00,NULL,479.00,NULL,0.00,'2025-05-02'),(22,'Watch','Smart watch','Compaq',1,1,1190.00,1650.00,NULL,10999.00,NULL,0.00,'2025-05-02'),(23,'12W Charger','V8 Charger','Voyx',3,1,100.00,300.00,NULL,599.00,NULL,0.00,'2025-05-02'),(24,'UDM-788 charger','Button Phone Charger','UDM',1,1,80.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(25,'3.1A charger','V8 Charger','Voyx',1,1,130.00,350.00,NULL,599.00,NULL,0.00,'2025-05-02'),(26,'30W charger','V8 Charger','Evan',2,1,130.00,299.00,NULL,299.00,NULL,0.00,'2025-05-02'),(27,'3.1A charger','Type-C Charger','Voyx',1,1,140.00,360.00,NULL,599.00,NULL,0.00,'2025-05-02'),(28,'12W charger','Type-C Charger','Voyx',1,1,110.00,300.00,NULL,499.00,NULL,0.00,'2025-05-02'),(29,'UX-121 charger','Type-C Charger','Unix',0,1,110.00,300.00,NULL,499.00,NULL,0.00,'2025-05-02'),(30,'2.1A charger','Type-C Charger','MXD',2,1,90.00,250.00,NULL,349.00,NULL,0.00,'2025-05-02'),(31,'44W charger','Type-C Charger','Voyx',1,1,340.00,650.00,NULL,2999.00,NULL,0.00,'2025-05-02'),(32,'25W adapter','C pin adapter','Samsung',2,1,250.00,550.00,NULL,2499.00,NULL,0.00,'2025-05-02'),(33,'Mi 18W adapter','Mi adapter','Xiaomi',2,1,400.00,750.00,NULL,799.00,NULL,0.00,'2025-05-02'),(34,'Mouse zebronics','Mouse','Zebronics',1,1,110.00,200.00,NULL,229.00,NULL,0.00,'2025-05-02'),(35,'Rockerz 111','Neck band','Boat',1,1,820.00,1350.00,NULL,2490.00,NULL,0.00,'2025-05-02'),(36,'Rockerz summit','Neck band','Boat',1,1,750.00,1300.00,NULL,4490.00,NULL,0.00,'2025-05-02'),(37,'Rockerz 110','Neck band','Boat',1,1,820.00,1350.00,NULL,2490.00,NULL,0.00,'2025-05-02'),(38,'Rockerz 255 Max','Neck band','Boat',1,1,930.00,1550.00,NULL,3990.00,NULL,0.00,'2025-05-02'),(39,'Rockerz 109','Neck band','Boat',1,1,850.00,1400.00,NULL,2490.00,NULL,0.00,'2025-05-02'),(40,'MXD-803','Neck band','MXD',1,1,200.00,750.00,NULL,750.00,NULL,0.00,'2025-05-02'),(41,'Neck band BT-153','Neck band','Mak power',2,1,170.00,499.00,NULL,499.00,NULL,0.00,'2025-05-02'),(42,'Battery','Battery','Jio',1,1,110.00,300.00,NULL,799.00,NULL,0.00,'2025-05-02'),(43,'Battery','Battery','Nokia',3,1,110.00,250.00,NULL,349.00,NULL,0.00,'2025-05-02'),(44,'Battery','Battery','Voyx',3,1,120.00,300.00,NULL,799.00,NULL,0.00,'2025-05-02'),(45,'Battery','Battery','Original',1,1,110.00,250.00,NULL,250.00,NULL,0.00,'2025-05-02'),(46,'Battery','Battery','AM Diamond',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(47,'Battery','Battery','Avinoc',2,1,120.00,250.00,NULL,599.00,NULL,0.00,'2025-05-02'),(48,'Trimmer 1c','Beard Trimmer','Xiaomi',1,1,973.00,1500.00,NULL,1500.00,NULL,0.00,'2025-05-02'),(49,'22W V8 cable','V8 Cable','Voyx',3,1,30.00,150.00,NULL,299.00,NULL,0.00,'2025-05-02'),(50,'V8 cable','V8 Cable','Vingajoy',1,1,25.00,150.00,NULL,199.00,NULL,0.00,'2025-05-02'),(51,'V8 cable','V8 Cable','LAVA',1,1,50.00,110.00,NULL,499.00,NULL,0.00,'2025-05-02'),(52,'20W C-cable','Type-C cable','Avinoc',4,1,35.00,150.00,NULL,299.00,NULL,0.00,'2025-05-02'),(53,'30W C-cable','Type-C cable','Voyx',2,1,60.00,300.00,NULL,699.00,NULL,0.00,'2025-05-02'),(54,'USB Type-C cable','Type-C cable','Xiaomi',8,1,149.00,250.00,NULL,299.00,NULL,0.00,'2025-05-02'),(55,'Multi pin cable','Multi pin Cable','Ruby',1,1,145.00,250.00,NULL,250.00,NULL,0.00,'2025-05-02'),(56,'Iphone cable','Iphone cable','Treams',1,1,60.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(57,'Power bank cable Type-C','Power bank cable Type-C','Voyx',4,1,50.00,150.00,NULL,799.00,NULL,0.00,'2025-05-02'),(58,'Type-C cable','Type-C cable','LAVA',1,1,60.00,110.00,NULL,499.00,NULL,0.00,'2025-05-02'),(59,'C to C cable','C to C cable','Ycom',1,1,100.00,250.00,NULL,749.00,NULL,0.00,'2025-05-02'),(60,'Power bank cable V8','Power bank cable V8','BS power',1,1,20.00,100.00,NULL,100.00,NULL,0.00,'2025-05-02'),(61,'Power bank cable Type-C','Power bank cable Type-C','BS power',2,1,25.00,100.00,NULL,100.00,NULL,0.00,'2025-05-02'),(62,'10000 mAh Power bank','Power bank','Voyx',2,1,580.00,980.00,NULL,1999.00,NULL,0.00,'2025-05-02'),(63,'Type-C OTG','Cable OTG','Ubon',1,1,45.00,100.00,NULL,100.00,NULL,0.00,'2025-05-02'),(64,'V8 OTG','Cable OTG','Ubon',2,1,35.00,100.00,NULL,100.00,NULL,0.00,'2025-05-02'),(65,'V8 OTG','Cable OTG','Unix',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(66,'8GB Pendrive','Pendrive','Sandisk',1,1,190.00,300.00,NULL,300.00,NULL,0.00,'2025-05-02'),(67,'8GB Pendrive','Pendrive','HP',1,1,190.00,500.00,NULL,600.00,NULL,0.00,'2025-05-02'),(68,'16GB Pendrive','Pendrive','Morsim',1,1,230.00,499.00,NULL,499.00,NULL,0.00,'2025-05-02'),(69,'32GB Pendrive','Pendrive','Sandisk',1,1,250.00,700.00,NULL,700.00,NULL,0.00,'2025-05-02'),(70,'64GB Pendrive','Pendrive','Sandisk',1,1,340.00,800.00,NULL,1100.00,NULL,0.00,'2025-05-02'),(71,'128GB Pendrive','Pendrive','Sandisk',1,1,440.00,900.00,NULL,2200.00,NULL,0.00,'2025-05-02'),(72,'8GB Memory','Memory card','Cross',1,1,160.00,399.00,NULL,399.00,NULL,0.00,'2025-05-02'),(73,'16GB Memory','Memory card','Sandisk',1,1,210.00,450.00,NULL,550.00,NULL,0.00,'2025-05-02'),(74,'32GB Memory','Memory card','Sandisk',1,1,240.00,550.00,NULL,1500.00,NULL,0.00,'2025-05-02'),(75,'32GB Memory','Memory card','Morsim',1,1,250.00,550.00,NULL,999.00,NULL,0.00,'2025-05-02'),(76,'128GB Memory','Memory card','Sandisk',1,1,550.00,800.00,NULL,2500.00,NULL,0.00,'2025-05-02'),(77,'V8 cable 2 meter','V8 Cable','Lebon',1,1,100.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(78,'Note 13 5G','Back case','Redmi',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(79,'12 5G','Back case','Redmi',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(80,'13C 5G','Back case','Redmi',2,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(81,'A3X','Back case','Redmi',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(82,'F27','Back case','Oppo',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(83,'A11K','Back case','Oppo',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(84,'Real 3','Back case','Realme',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(85,'14X 5G','Back case','Realme',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(86,'Real 5','Back case','Realme',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(87,'A78 5G','Back case','Oppo',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(88,'S1 Indian','Back case','Samsung',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(89,'Y33S','Back case','Vivo',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(90,'T3lite','Back case','Vivo',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(91,'F17 / A73','Back case','Oppo',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(92,'VIY93','Back case','Vivo',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(93,'V23E','Back case','Vivo',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(94,'POCO C65','Back case','Redmi',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(95,'11 5G','Back case','Realme',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(96,'Redmi Note 9 Pro 5G','Back case','Redmi',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(97,'10A','Back case','Redmi',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(98,'Note 13 5G','Back case','Redmi',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(99,'M6 Pro 5G','Back case','Redmi',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(100,'Redmi 9I','Back case','Redmi',0,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(101,'Note 12 Pro','Back case','Redmi',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(102,'Note 11 5G','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(103,'POCO C31','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(104,'A59 4G','Back case','Oppo',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(105,'A59 5G','Back case','Oppo',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(106,'A15/15S','Back case','Oppo',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(107,'MIY2','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(108,'11 Prime 5G','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(109,'Note 9 Pro','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(110,'Note 13','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(111,'Mi 9 Prime','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(112,'A-58 4G','Flip case','Oppo',3,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(113,'A-38 4G','Flip case','Oppo',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(114,'A-16','Flip case','Oppo',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(115,'A3X 5G','Flip case','Oppo',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(116,'A54 4G','Flip case','Oppo',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(117,'13C 4G','Flip case','Redmi',4,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(118,'Y 15','Flip case','Vivo',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(119,'Y 10','Flip case','Vivo',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(120,'Y 12','Flip case','Vivo',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(121,'F15 5G','Flip case','Samsung',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(122,'3 Pro','Flip case','Realme',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(123,'J1 Ace','Flip case','Samsung',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(124,'A30','Back case','Samsung',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(125,'M 01 Core','Back case','Samsung',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(126,'Card reader','Card reader','OTG+USB',5,1,13.00,50.00,NULL,50.00,NULL,0.00,'2025-05-02'),(127,'Headset','Headset','KDM',3,1,30.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(128,'Headset Type-C','Headset','Boat',1,1,160.00,400.00,NULL,400.00,NULL,0.00,'2025-05-02'),(129,'Gaming gloves','Gaming gloves','Wasp feelers',6,1,8.00,20.00,NULL,20.00,NULL,0.00,'2025-05-02'),(130,'Car charger','Car charger','Bhajwad',1,1,145.00,300.00,NULL,300.00,NULL,0.00,'2025-05-02'),(131,'14C 5G','Flip case','Redmi',4,1,65.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(132,'14C 5G','Back case','Redmi',6,1,40.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(133,'Redmi 13 5G / POCO M6 5G','Flip case','Redmi',2,1,65.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(134,'Redmi 13 5G / POCO M6 5G','Back case','Redmi',2,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(135,'POCO C61','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(136,'POCO C61','Back case','Redmi',1,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-02'),(137,'Redmi 13C 5G','Flip case','Redmi',2,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(138,'Redmi A1','Flip case','Redmi',2,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(139,'Redmi 5','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(140,'Redmi 5A','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(141,'Redmi 6A','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(142,'Redmi 7A','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(143,'Redmi 8A','Flip case','Redmi',1,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(144,'Redmi 9A','Flip case','Redmi',2,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(145,'Redmi 10A','Flip case','Redmi',2,1,80.00,200.00,NULL,200.00,NULL,0.00,'2025-05-02'),(146,'Redmi 9A','Tempered glass','Glass',6,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(147,'Redmi 13C 5G','Tempered glass','ESD',13,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(148,'Redmi 14C 5G','Tempered glass','Meibo',13,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(149,'Note 13','Tempered glass','ESD',6,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(150,'Redmi A3x','Tempered glass','MXD',3,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(151,'Redmi A4','Tempered glass','Elite',1,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(152,'Note 12 5G','Tempered glass','Super X',1,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(153,'Note 9 pro','Tempered glass','HD pro',1,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(154,'Realme 14x','Tempered glass','Super X',1,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(155,'Samsung M01 core','Tempered glass','Plusclass',1,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(156,'Vivo 51','Tempered glass','ESD',2,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(157,'Oppo A 5G','Tempered glass','Meibo',0,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(158,'Iphone tempered','Tempered glass','ESD',1,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(159,'Oppo A3S','Tempered glass','HD class',1,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(160,'POCO M3','Tempered glass','ESD',1,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(161,'Samsung F7 max','Tempered glass','G-Tel',1,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(162,'Redmi 6 pro','Tempered glass','G-Tel',1,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-03'),(163,'14C 35rs','Back case','Redmi',2,1,35.00,150.00,NULL,150.00,NULL,0.00,'2025-05-05'),(164,'Service - Samsung','Service','Samsung',1,0,1300.00,2100.00,NULL,2100.00,NULL,0.00,'2025-05-05'),(165,'Voyx car charger','Car charger','Voyx',1,1,195.00,450.00,'',2999.00,'',NULL,'2025-05-07'),(166,'Unix HP 40 neckband','Neck band','Unix',1,1,490.00,950.00,'',2499.00,'',NULL,'2025-05-07'),(167,'Redmi 10A flipcase','Flip case','Redmi',1,1,65.00,200.00,NULL,200.00,NULL,0.00,'2025-05-07'),(168,'Redmi 10A Tempered','Tempered glass','Redmi',1,1,20.00,150.00,NULL,150.00,NULL,0.00,'2025-05-07'),(169,'Aux cable','Aux cable','CRJ',2,1,40.00,100.00,'',100.00,'',NULL,'2025-05-07'),(170,'POCO C75 5G 4+64','Mobile','POCO',0,1,8100.00,10600.00,'',10999.00,'',NULL,'2025-05-07'),(171,'POCO M6 plus 5G 6+128','Mobile','POCO',0,1,10000.00,12500.00,NULL,15999.00,NULL,0.00,'2025-05-07'),(172,'POCO C61 4G 4+64','Mobile','POCO',1,1,6000.00,8500.00,NULL,8999.00,NULL,0.00,'2025-05-07'),(173,'Redmi A4 5G 4+64','Mobile','Redmi',1,1,8000.00,10500.00,NULL,10999.00,NULL,0.00,'2025-05-07'),(174,'Unix V8 data cable','V8 Cable','Unix',5,1,125.00,150.00,NULL,299.00,NULL,0.00,'2025-05-07'),(175,'POCO M6 plus tempered','Tempered glass','POCO',3,1,60.00,150.00,'',150.00,'',NULL,'2025-05-07'),(176,'Redmi 11 prime','Flip case','Redmi',1,1,70.00,150.00,NULL,150.00,NULL,0.00,'2025-05-07'),(177,'Redmi Service','Service','Redmi',0,0,250.00,350.00,'',350.00,'',NULL,'2025-05-11'),(178,'14C Temper','Tempered glass','ESD',5,1,30.00,150.00,'',150.00,'',NULL,'2025-05-11'),(179,'Vivo Y21','Tempered glass','Vivo',1,1,20.00,150.00,'',150.00,'',NULL,'2025-05-11'),(180,'13C Flip','Flip case','Redmi',1,1,65.00,200.00,'',200.00,'',NULL,'2025-05-11'),(181,'Redmi 14C 5G 4+128','Mobile','Redmi',1,1,9800.00,12500.00,'',13999.00,'',NULL,'2025-05-11');
/*!40000 ALTER TABLE `billingmodule_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_loan`
--

DROP TABLE IF EXISTS `billingmodule_loan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_loan` (
  `loan_accno` varchar(15) NOT NULL,
  `loan_amount` decimal(10,2) NOT NULL,
  `payment_amount` decimal(10,2) NOT NULL,
  `emi_amount` decimal(10,2) NOT NULL,
  `term` int NOT NULL,
  `payment_freq` varchar(15) NOT NULL,
  `interest` decimal(10,2) NOT NULL,
  `loan_date` date NOT NULL,
  `next_pay_date` date NOT NULL,
  `bal_amount` decimal(10,2) NOT NULL,
  `customer_id` int NOT NULL,
  `advance_bal` decimal(10,2) NOT NULL,
  `advance_paydate` date DEFAULT NULL,
  PRIMARY KEY (`loan_accno`),
  KEY `BillingModule_loan_customer_id_b0aea44a_fk_BillingMo` (`customer_id`),
  CONSTRAINT `BillingModule_loan_customer_id_b0aea44a_fk_BillingMo` FOREIGN KEY (`customer_id`) REFERENCES `billingmodule_customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_loan`
--

LOCK TABLES `billingmodule_loan` WRITE;
/*!40000 ALTER TABLE `billingmodule_loan` DISABLE KEYS */;
INSERT INTO `billingmodule_loan` VALUES ('20250510001',7500.00,12500.00,2083.00,6,'Monthly',5000.00,'2025-05-10','2025-06-10',13500.00,2,1000.00,'2025-05-16'),('20250510002',1100.00,1100.00,1100.00,1,'Monthly',0.00,'2025-05-10','2025-05-16',1100.00,2,0.00,NULL),('20250511001',7600.00,11500.00,1917.00,6,'Monthly',3900.00,'2025-05-11','2025-06-15',12000.00,3,500.00,'2025-05-17'),('20250511002',7600.00,11500.00,1917.00,6,'Monthly',3900.00,'2025-05-11','2025-06-15',12000.00,4,500.00,'2025-05-17');
/*!40000 ALTER TABLE `billingmodule_loan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_loanbill`
--

DROP TABLE IF EXISTS `billingmodule_loanbill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_loanbill` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bill_seq` int NOT NULL,
  `bill_date` date NOT NULL,
  `paid_date` date DEFAULT NULL,
  `due_amount` decimal(10,2) NOT NULL,
  `late_fee` decimal(10,2) NOT NULL,
  `total_due` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) NOT NULL,
  `loan_acc_id` varchar(15) NOT NULL,
  `due_type` varchar(20) NOT NULL,
  `int` decimal(10,2) NOT NULL,
  `prin` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `BillingModule_loanbi_loan_acc_id_483fa9f3_fk_BillingMo` (`loan_acc_id`),
  CONSTRAINT `BillingModule_loanbi_loan_acc_id_483fa9f3_fk_BillingMo` FOREIGN KEY (`loan_acc_id`) REFERENCES `billingmodule_loan` (`loan_accno`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_loanbill`
--

LOCK TABLES `billingmodule_loanbill` WRITE;
/*!40000 ALTER TABLE `billingmodule_loanbill` DISABLE KEYS */;
INSERT INTO `billingmodule_loanbill` VALUES (1,1,'2025-05-16',NULL,1000.00,0.00,1000.00,0.00,'20250510001','Advance',0.00,1000.00),(2,2,'2025-06-10',NULL,2083.00,0.00,2083.00,0.00,'20250510001','EMI',833.00,1250.00),(3,3,'2025-07-10',NULL,2083.00,0.00,2083.00,0.00,'20250510001','EMI',833.00,1250.00),(4,4,'2025-08-09',NULL,2083.00,0.00,2083.00,0.00,'20250510001','EMI',833.00,1250.00),(5,5,'2025-09-08',NULL,2083.00,0.00,2083.00,0.00,'20250510001','EMI',833.00,1250.00),(6,6,'2025-10-08',NULL,2083.00,0.00,2083.00,0.00,'20250510001','EMI',833.00,1250.00),(7,7,'2025-11-07',NULL,2083.00,0.00,2083.00,0.00,'20250510001','EMI',833.00,1250.00),(8,1,'2025-05-16',NULL,1100.00,0.00,1100.00,0.00,'20250510002','EMI',0.00,1100.00),(9,1,'2025-05-17',NULL,500.00,0.00,500.00,0.00,'20250511001','Advance',0.00,500.00),(10,2,'2025-06-15',NULL,1917.00,0.00,1917.00,0.00,'20250511001','EMI',650.00,1267.00),(11,3,'2025-07-15',NULL,1917.00,0.00,1917.00,0.00,'20250511001','EMI',650.00,1267.00),(12,4,'2025-08-14',NULL,1917.00,0.00,1917.00,0.00,'20250511001','EMI',650.00,1267.00),(13,5,'2025-09-13',NULL,1917.00,0.00,1917.00,0.00,'20250511001','EMI',650.00,1267.00),(14,6,'2025-10-13',NULL,1917.00,0.00,1917.00,0.00,'20250511001','EMI',650.00,1267.00),(15,7,'2025-11-12',NULL,1917.00,0.00,1917.00,0.00,'20250511001','EMI',650.00,1267.00),(16,1,'2025-05-17',NULL,500.00,0.00,500.00,0.00,'20250511002','Advance',0.00,500.00),(17,2,'2025-06-15',NULL,1917.00,0.00,1917.00,0.00,'20250511002','EMI',650.00,1267.00),(18,3,'2025-07-15',NULL,1917.00,0.00,1917.00,0.00,'20250511002','EMI',650.00,1267.00),(19,4,'2025-08-14',NULL,1917.00,0.00,1917.00,0.00,'20250511002','EMI',650.00,1267.00),(20,5,'2025-09-13',NULL,1917.00,0.00,1917.00,0.00,'20250511002','EMI',650.00,1267.00),(21,6,'2025-10-13',NULL,1917.00,0.00,1917.00,0.00,'20250511002','EMI',650.00,1267.00),(22,7,'2025-11-12',NULL,1917.00,0.00,1917.00,0.00,'20250511002','EMI',650.00,1267.00);
/*!40000 ALTER TABLE `billingmodule_loanbill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_loanjournal`
--

DROP TABLE IF EXISTS `billingmodule_loanjournal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_loanjournal` (
  `journal_id` int NOT NULL AUTO_INCREMENT,
  `journal_seq` int NOT NULL,
  `journal_date` date NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `description` longtext NOT NULL,
  `old_data` decimal(10,2) DEFAULT NULL,
  `new_data` decimal(10,2) DEFAULT NULL,
  `crdr` tinyint(1) NOT NULL,
  `trans_amt` decimal(10,2) NOT NULL,
  `balance_amount` decimal(10,2) NOT NULL,
  `loan_id` varchar(15) NOT NULL,
  PRIMARY KEY (`journal_id`),
  KEY `BillingModule_loanjo_loan_id_aec68b73_fk_BillingMo` (`loan_id`),
  CONSTRAINT `BillingModule_loanjo_loan_id_aec68b73_fk_BillingMo` FOREIGN KEY (`loan_id`) REFERENCES `billingmodule_loan` (`loan_accno`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_loanjournal`
--

LOCK TABLES `billingmodule_loanjournal` WRITE;
/*!40000 ALTER TABLE `billingmodule_loanjournal` DISABLE KEYS */;
INSERT INTO `billingmodule_loanjournal` VALUES (1,1,'2025-05-10','CREATE','Loan account creation',NULL,13500.00,0,13500.00,13500.00,'20250510001'),(2,1,'2025-05-10','CREATE','Loan account creation',NULL,1100.00,0,1100.00,1100.00,'20250510002'),(3,1,'2025-05-11','CREATE','Loan account creation with adv',NULL,12000.00,0,12000.00,12000.00,'20250511001'),(4,1,'2025-05-11','CREATE','Loan account creation with adv',NULL,12000.00,0,12000.00,12000.00,'20250511002');
/*!40000 ALTER TABLE `billingmodule_loanjournal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_payment`
--

DROP TABLE IF EXISTS `billingmodule_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `cash` decimal(10,2) NOT NULL,
  `account` decimal(10,2) NOT NULL,
  `credit` decimal(10,2) NOT NULL,
  PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_payment`
--

LOCK TABLES `billingmodule_payment` WRITE;
/*!40000 ALTER TABLE `billingmodule_payment` DISABLE KEYS */;
INSERT INTO `billingmodule_payment` VALUES (1,12500.00,0.00,0.00),(2,150.00,0.00,0.00),(3,200.00,0.00,0.00),(4,1600.00,0.00,0.00),(5,350.00,0.00,0.00),(6,150.00,0.00,0.00),(7,300.00,0.00,0.00),(8,1150.00,0.00,0.00),(9,10600.00,0.00,0.00),(10,10600.00,0.00,0.00);
/*!40000 ALTER TABLE `billingmodule_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_purchase`
--

DROP TABLE IF EXISTS `billingmodule_purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_purchase` (
  `purchase_id` varchar(15) NOT NULL,
  `purchase_seq` int NOT NULL,
  `purchase_date` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `balance` decimal(10,2) NOT NULL,
  `purchase_payment_id` int DEFAULT NULL,
  `seller_id` int NOT NULL,
  PRIMARY KEY (`purchase_id`),
  UNIQUE KEY `purchase_payment_id` (`purchase_payment_id`),
  KEY `BillingModule_purcha_seller_id_5620759c_fk_BillingMo` (`seller_id`),
  CONSTRAINT `BillingModule_purcha_purchase_payment_id_29a214da_fk_BillingMo` FOREIGN KEY (`purchase_payment_id`) REFERENCES `billingmodule_purchasepayment` (`payment_id`),
  CONSTRAINT `BillingModule_purcha_seller_id_5620759c_fk_BillingMo` FOREIGN KEY (`seller_id`) REFERENCES `billingmodule_seller` (`seller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_purchase`
--

LOCK TABLES `billingmodule_purchase` WRITE;
/*!40000 ALTER TABLE `billingmodule_purchase` DISABLE KEYS */;
INSERT INTO `billingmodule_purchase` VALUES ('PUR-2025-1',1,'2025-05-11',485.00,485.00,0.00,0.00,1,1),('PUR-2025-2',2,'2025-05-11',9800.00,9800.00,0.00,0.00,2,2);
/*!40000 ALTER TABLE `billingmodule_purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_purchasebill`
--

DROP TABLE IF EXISTS `billingmodule_purchasebill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_purchasebill` (
  `bill_year` int NOT NULL,
  `bill_seq` int NOT NULL,
  PRIMARY KEY (`bill_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_purchasebill`
--

LOCK TABLES `billingmodule_purchasebill` WRITE;
/*!40000 ALTER TABLE `billingmodule_purchasebill` DISABLE KEYS */;
INSERT INTO `billingmodule_purchasebill` VALUES (2025,2);
/*!40000 ALTER TABLE `billingmodule_purchasebill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_purchaseitem`
--

DROP TABLE IF EXISTS `billingmodule_purchaseitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_purchaseitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `item_seq` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `product_id` int NOT NULL,
  `purchase_id` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `BillingModule_purcha_product_id_93a45cd0_fk_BillingMo` (`product_id`),
  KEY `BillingModule_purcha_purchase_id_c023c983_fk_BillingMo` (`purchase_id`),
  CONSTRAINT `BillingModule_purcha_product_id_93a45cd0_fk_BillingMo` FOREIGN KEY (`product_id`) REFERENCES `billingmodule_item` (`item_id`),
  CONSTRAINT `BillingModule_purcha_purchase_id_c023c983_fk_BillingMo` FOREIGN KEY (`purchase_id`) REFERENCES `billingmodule_purchase` (`purchase_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_purchaseitem`
--

LOCK TABLES `billingmodule_purchaseitem` WRITE;
/*!40000 ALTER TABLE `billingmodule_purchaseitem` DISABLE KEYS */;
INSERT INTO `billingmodule_purchaseitem` VALUES (1,1,1,250.00,250.00,177,'PUR-2025-1'),(2,2,1,65.00,65.00,180,'PUR-2025-1'),(3,3,1,20.00,20.00,179,'PUR-2025-1'),(4,4,5,30.00,150.00,178,'PUR-2025-1'),(5,1,1,9800.00,9800.00,181,'PUR-2025-2');
/*!40000 ALTER TABLE `billingmodule_purchaseitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_purchasepayment`
--

DROP TABLE IF EXISTS `billingmodule_purchasepayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_purchasepayment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `cash` decimal(10,2) NOT NULL,
  `account` decimal(10,2) NOT NULL,
  `credit` decimal(10,2) NOT NULL,
  PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_purchasepayment`
--

LOCK TABLES `billingmodule_purchasepayment` WRITE;
/*!40000 ALTER TABLE `billingmodule_purchasepayment` DISABLE KEYS */;
INSERT INTO `billingmodule_purchasepayment` VALUES (1,485.00,0.00,0.00),(2,9800.00,0.00,0.00);
/*!40000 ALTER TABLE `billingmodule_purchasepayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_sale`
--

DROP TABLE IF EXISTS `billingmodule_sale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_sale` (
  `bill_no` varchar(15) NOT NULL,
  `sale_seq` int NOT NULL,
  `sale_date` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `balance` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) NOT NULL,
  `customer_id` int DEFAULT NULL,
  `payment_id` int DEFAULT NULL,
  `income` decimal(10,2) NOT NULL,
  PRIMARY KEY (`bill_no`),
  UNIQUE KEY `payment_id` (`payment_id`),
  KEY `BillingModule_sale_customer_id_d190c3e7_fk_BillingMo` (`customer_id`),
  CONSTRAINT `BillingModule_sale_customer_id_d190c3e7_fk_BillingMo` FOREIGN KEY (`customer_id`) REFERENCES `billingmodule_customer` (`customer_id`),
  CONSTRAINT `BillingModule_sale_payment_id_71ca8c69_fk_BillingMo` FOREIGN KEY (`payment_id`) REFERENCES `billingmodule_payment` (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_sale`
--

LOCK TABLES `billingmodule_sale` WRITE;
/*!40000 ALTER TABLE `billingmodule_sale` DISABLE KEYS */;
INSERT INTO `billingmodule_sale` VALUES ('BILL-2025-1',1,'2025-05-10',12500.00,0.00,0.00,12500.00,2,1,2500.00),('BILL-2025-10',10,'2025-05-11',10600.00,0.00,0.00,10600.00,4,10,2500.00),('BILL-2025-2',2,'2025-05-10',150.00,0.00,0.00,150.00,1,2,130.00),('BILL-2025-3',3,'2025-05-10',200.00,0.00,0.00,200.00,1,3,135.00),('BILL-2025-4',4,'2025-05-10',1600.00,0.00,0.00,1600.00,2,4,610.00),('BILL-2025-5',5,'2025-05-11',350.00,0.00,0.00,350.00,1,5,100.00),('BILL-2025-6',6,'2025-05-11',150.00,0.00,0.00,150.00,1,6,120.00),('BILL-2025-7',7,'2025-05-11',300.00,0.00,0.00,300.00,1,7,235.00),('BILL-2025-8',8,'2025-05-11',1150.00,49.00,0.00,1150.00,1,8,350.00),('BILL-2025-9',9,'2025-05-11',10600.00,0.00,0.00,10600.00,3,9,2500.00);
/*!40000 ALTER TABLE `billingmodule_sale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_salebill`
--

DROP TABLE IF EXISTS `billingmodule_salebill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_salebill` (
  `bill_year` int NOT NULL,
  `bill_seq` int NOT NULL,
  PRIMARY KEY (`bill_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_salebill`
--

LOCK TABLES `billingmodule_salebill` WRITE;
/*!40000 ALTER TABLE `billingmodule_salebill` DISABLE KEYS */;
INSERT INTO `billingmodule_salebill` VALUES (2025,10);
/*!40000 ALTER TABLE `billingmodule_salebill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_saleitem`
--

DROP TABLE IF EXISTS `billingmodule_saleitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_saleitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `item_seq` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `product_id` int NOT NULL,
  `sale_id` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `BillingModule_saleit_product_id_7d57f110_fk_BillingMo` (`product_id`),
  KEY `BillingModule_saleit_sale_id_654aa415_fk_BillingMo` (`sale_id`),
  CONSTRAINT `BillingModule_saleit_product_id_7d57f110_fk_BillingMo` FOREIGN KEY (`product_id`) REFERENCES `billingmodule_item` (`item_id`),
  CONSTRAINT `BillingModule_saleit_sale_id_654aa415_fk_BillingMo` FOREIGN KEY (`sale_id`) REFERENCES `billingmodule_sale` (`bill_no`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_saleitem`
--

LOCK TABLES `billingmodule_saleitem` WRITE;
/*!40000 ALTER TABLE `billingmodule_saleitem` DISABLE KEYS */;
INSERT INTO `billingmodule_saleitem` VALUES (1,1,1,12500.00,12500.00,171,'BILL-2025-1'),(2,1,1,150.00,150.00,147,'BILL-2025-2'),(3,1,1,200.00,200.00,131,'BILL-2025-3'),(4,1,1,1600.00,1600.00,19,'BILL-2025-4'),(5,1,1,350.00,350.00,177,'BILL-2025-5'),(6,1,1,150.00,150.00,49,'BILL-2025-6'),(7,1,1,150.00,150.00,100,'BILL-2025-7'),(8,2,1,150.00,150.00,127,'BILL-2025-7'),(9,1,1,1199.00,1199.00,13,'BILL-2025-8'),(10,1,1,10600.00,10600.00,170,'BILL-2025-9'),(11,1,1,10600.00,10600.00,170,'BILL-2025-10');
/*!40000 ALTER TABLE `billingmodule_saleitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billingmodule_seller`
--

DROP TABLE IF EXISTS `billingmodule_seller`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billingmodule_seller` (
  `seller_id` int NOT NULL AUTO_INCREMENT,
  `seller_name` varchar(255) NOT NULL,
  `seller_mph` varchar(128) NOT NULL,
  `address` longtext NOT NULL,
  PRIMARY KEY (`seller_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billingmodule_seller`
--

LOCK TABLES `billingmodule_seller` WRITE;
/*!40000 ALTER TABLE `billingmodule_seller` DISABLE KEYS */;
INSERT INTO `billingmodule_seller` VALUES (1,'Cellcom','+919786089626','Tenkasi'),(2,'Abdul Kather','+919080094442','Tirunelveli');
/*!40000 ALTER TABLE `billingmodule_seller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(7,'BillingModule','brand'),(25,'BillingModule','cashgl'),(8,'BillingModule','category'),(9,'BillingModule','compdet'),(10,'BillingModule','customer'),(26,'BillingModule','glbal'),(19,'BillingModule','glhist'),(28,'BillingModule','income'),(27,'BillingModule','invest'),(11,'BillingModule','item'),(18,'BillingModule','loan'),(20,'BillingModule','loanbill'),(21,'BillingModule','loanjournal'),(12,'BillingModule','payment'),(13,'BillingModule','purchase'),(14,'BillingModule','purchasebill'),(22,'BillingModule','purchaseitem'),(15,'BillingModule','purchasepayment'),(23,'BillingModule','sale'),(16,'BillingModule','salebill'),(24,'BillingModule','saleitem'),(17,'BillingModule','seller'),(5,'contenttypes','contenttype'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'BillingModule','0001_initial','2025-05-02 05:01:26.980447'),(2,'contenttypes','0001_initial','2025-05-02 05:01:27.204137'),(3,'auth','0001_initial','2025-05-02 05:01:29.610792'),(4,'admin','0001_initial','2025-05-02 05:01:30.079083'),(5,'admin','0002_logentry_remove_auto_add','2025-05-02 05:01:30.118011'),(6,'admin','0003_logentry_add_action_flag_choices','2025-05-02 05:01:30.173775'),(7,'contenttypes','0002_remove_content_type_name','2025-05-02 05:01:30.638594'),(8,'auth','0002_alter_permission_name_max_length','2025-05-02 05:01:30.864145'),(9,'auth','0003_alter_user_email_max_length','2025-05-02 05:01:30.981429'),(10,'auth','0004_alter_user_username_opts','2025-05-02 05:01:31.008943'),(11,'auth','0005_alter_user_last_login_null','2025-05-02 05:01:31.283948'),(12,'auth','0006_require_contenttypes_0002','2025-05-02 05:01:31.293401'),(13,'auth','0007_alter_validators_add_error_messages','2025-05-02 05:01:31.322363'),(14,'auth','0008_alter_user_username_max_length','2025-05-02 05:01:31.633701'),(15,'auth','0009_alter_user_last_name_max_length','2025-05-02 05:01:31.870047'),(16,'auth','0010_alter_group_name_max_length','2025-05-02 05:01:31.989635'),(17,'auth','0011_update_proxy_permissions','2025-05-02 05:01:32.078345'),(18,'auth','0012_alter_user_first_name_max_length','2025-05-02 05:01:32.344938'),(19,'sessions','0001_initial','2025-05-02 05:01:32.494945'),(20,'BillingModule','0002_alter_brand_brand_name_alter_category_category_name','2025-05-02 05:28:25.451393'),(21,'BillingModule','0003_sale_income','2025-05-03 06:23:37.554100'),(22,'BillingModule','0004_cashgl_glbal','2025-05-03 10:36:54.142502'),(23,'BillingModule','0005_alter_glhist_date_alter_loan_loan_date_and_more','2025-05-03 10:36:56.151255'),(24,'BillingModule','0006_alter_glhist_date_alter_loan_loan_date_and_more','2025-05-03 10:49:35.144057'),(25,'BillingModule','0007_rename_gl_acc_glbal_glacc','2025-05-03 11:02:33.772941'),(26,'BillingModule','0008_rename_glacc_glbal_glac','2025-05-03 11:02:34.410907'),(27,'BillingModule','0003_cashgl_sale_income_glbal','2025-05-03 13:45:22.095817'),(28,'BillingModule','0004_remove_sale_income','2025-05-03 13:45:22.200811'),(29,'BillingModule','0005_sale_income','2025-05-03 13:46:30.704970'),(30,'BillingModule','0006_alter_cashgl_date_alter_customer_created_at_and_more','2025-05-05 02:50:09.331876'),(31,'BillingModule','0003_cashgl_sale_income_alter_customer_created_at_and_more','2025-05-05 05:40:57.430528'),(32,'BillingModule','0004_alter_glbal_glac','2025-05-05 05:49:11.223690'),(33,'BillingModule','0005_loan_advance_amt_loan_advance_paydate','2025-05-05 10:51:01.344070'),(34,'BillingModule','0006_rename_advance_amt_loan_advance_bal','2025-05-05 11:17:20.649047'),(35,'BillingModule','0007_loanbill_due_type','2025-05-05 11:44:34.218512'),(36,'BillingModule','0008_invest','2025-05-06 06:03:18.099930'),(37,'BillingModule','0009_income','2025-05-07 12:37:34.039855'),(38,'BillingModule','0010_loanbill_int_loanbill_prin','2025-05-08 08:12:16.988349'),(39,'BillingModule','0011_alter_loan_advance_paydate','2025-05-08 13:49:11.145325'),(40,'BillingModule','0012_invest_source','2025-05-09 05:45:58.414464'),(41,'BillingModule','0013_income_inctype','2025-05-10 06:38:12.449430');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 11:01:03
