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
-- Table structure for table `user_edits`
--

DROP TABLE IF EXISTS `user_edits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_edits` (
  `user_id` int NOT NULL,
  `entry_id` int NOT NULL,
  `edit` json NOT NULL,
  `created` datetime(6) NOT NULL,
  PRIMARY KEY (`user_id`,`entry_id`),
  KEY `user_edits` (`entry_id`),
  CONSTRAINT `user_edits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_edits_ibfk_2` FOREIGN KEY (`entry_id`) REFERENCES `entries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_edits`
--

LOCK TABLES `user_edits` WRITE;
/*!40000 ALTER TABLE `user_edits` DISABLE KEYS */;
INSERT INTO `user_edits` VALUES (1,14,'[{\"type\": \"heading-one\", \"children\": [{\"text\": \"Rendering Custom Elements\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Adding in HTML elements to the document requires providing a series of renderers for each element. These are simple React components that return small amounts of HTML, that being usually the tag in question to be rendered, although some of these tags may need additional tags for the sake of functionality, in particular images. Images amongst other more complex tags will be discussed later as they require additional changes to be made to the editor object to function.\"}]}, {\"url\": \"https://i.imgur.com/IndaSg8.png\", \"type\": \"image\", \"children\": [{\"text\": \"\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"Figure 5.1 displays the function that does this within the entry creator file found in the client portion of the project. It requires the attributes parameter for the given tag, these are attributes that are required by Slate to handle both rendering them alongside allowing editable text; the children parameter, this is essentially the text content for the element; the element parameter, this is an element from the document JSON list, in which the type is used to determine what element to render within the switch. The default option is to display the text within a paragraph tag if no type is specified.\"}]}, {\"type\": \"heading-one\", \"children\": [{\"text\": \"Rendering Images\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"As stated previously, rendering images requires more to be done for these to be functional and to provide minimal interference with the rest of the editor. Doing this requires the usage of a few more Slate packages, those being slate-history and some non-Slate packages such as isURL and image-extensions.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"For images to be inserted, the editor object needs some modifications which are done by the function displayed in figure 5.5. This function alongside functions the insertImage and image function are adapted from the Slate GitHub repository. Originally, they were written in TypeScript and were adapted to JavaScript. This mainly meant removing types as JavaScript is dynamically typed. \"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"As for what the function above does, essentially it changes some of the behaviour of the isVoid function provided by Slate, alongside changing the behaviour of the insertData function. For the former this means if it encounters an element with an image type it returns true, else it performs the normal functionality of the function. For the latter, this means checking two conditions, that is if files exist which if untrue, then checks if text is an image address in which it will insert the image, and then if that is untrue will assume normal data insertion is required. Provided files exist, the algorithm will run through each file looking for an image, in which it will use a file reader to get an image URL and then try to use the insertImage function.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"The insertImage function will create a block element for the image, providing a type, a URL, and a child list, then insert the element into the document JSON.\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"The image function is a React component that is used for rendering images, it requires the standard parameters for any render component, those being attributes, children, and element. This is one of the render components which requires additional functionality, since it is not text that a user can remove easily, it needs to have some method to remove the image. Doing this involved adding a button to the render component, which when clicked removes the element from the document JSON. The button was adapted for this system as the original code used custom buttons, these are replaced with regular bootstrap buttons mimicking the same functionality.\"}]}, {\"type\": \"heading-one\", \"children\": [{\"text\": \"Database Storage\"}]}, {\"type\": \"paragraph\", \"children\": [{\"text\": \"\"}]}]','2022-07-28 23:19:07.000000');
/*!40000 ALTER TABLE `user_edits` ENABLE KEYS */;
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
