-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 12, 2020 at 03:25 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `s3`
--

-- --------------------------------------------------------

--
-- Table structure for table `buckets`
--

CREATE TABLE `buckets` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `buckets`
--

INSERT INTO `buckets` (`id`, `name`, `owner`) VALUES
('1sfnbgRSLlwNhKKqhIkgi4PJXHgVaDHQQJGhfYVDUYkeVCtpPP', 'college', '93pBx9DrJb'),
('il8IEtg7K66PhGaPDfE8yjS2kpW9CpVH2az2zQnti44i7pbNb3', 'aaa', '93pBx9DrJb'),
('vNMy6rxn1xBA7rrPcC6E5PE45CvEuR3QzgLtLGBBDEldUauu0H', 's3', '93pBx9DrJb');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `bucketname` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `public` varchar(255) DEFAULT NULL,
  `share` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `name`, `bucketname`, `owner`, `public`, `share`) VALUES
('vvTzOgNcvNvXNuh4q9frdFLhiWg3afaU3WOkt9SRjwtHbaUqLEQ3eM8TBwNfSaq018jayiO3I7infPq4pyffh2j8WCHHBPLzt8w8', '7l_csgo_setup.exe', 'college', '93pBx9DrJb', '5UvOACgcmeOxl7h', 'shareUTWEW'),
('QOdAYldGbOTkcSsv6XYvDK2U0yO24dxqh1pigjvWvsgP1kVT14Jz9uveku5Sz1tws5CdlbGkjQA2p6jHq0FlXc5gBPd1ClQJxGb1', 'ADE_4.5_Installer.exe', 'college', '93pBx9DrJb', 'Mg6MYrZF8rMrndD', 'shareLGsxu'),
('YAh8bnDbKvPTF3PD6eoHjervt5ipo3iSr8CEUsxoUwuxV02y3e11ogWKQHygTcZQ7PP8nFLEavJaa3kGodGNy5ibvK3qtoKNygRF', 'Postman-win64-7.1.1-Setup.exe', 'college', '93pBx9DrJb', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `username`, `password`) VALUES
('93pBx9DrJb', 'admin', 'admin'),
('ev7HcHScL0', 'tmp', 'tmp');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
