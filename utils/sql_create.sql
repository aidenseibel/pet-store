CREATE SCHEMA `hamsterstore_test`;

CREATE TABLE `hamsterstore_test`.`cart` (
  `userid` int NOT NULL,
  `listing` int NOT NULL,
  `quantity` int NOT NULL,
  `cartitemid` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`cartitemid`),
  UNIQUE KEY `userid_UNIQUE` (`cartitemid`)
);

CREATE TABLE `hamsterstore_test`.`listings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `price` float unsigned NOT NULL,
  `vendor_id` int unsigned NOT NULL,
  `vendor_username` varchar(45) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `amount` varchar(45) NOT NULL,
  `ingredients` varchar(150) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idlistings_UNIQUE` (`id`),
  UNIQUE KEY `owneremail_UNIQUE` (`name`),
  KEY `vendor_username_idx` (`vendor_username`)
);

CREATE TABLE `hamsterstore_test`.`orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `vendor_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `has_been_delivered` tinyint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
);

CREATE TABLE `hamsterstore_test`.`session` (
  `idsession` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  PRIMARY KEY (`idsession`),
  UNIQUE KEY `userid_UNIQUE` (`userid`)
);

CREATE TABLE `hamsterstore_test`.`user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `physical_address` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `zip` varchar(45) DEFAULT NULL,
  `is_vendor` tinyint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
);

