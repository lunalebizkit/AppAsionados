-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 31-05-2021 a las 16:40:14
-- Versión del servidor: 5.5.24-log
-- Versión de PHP: 5.4.3

SET SQL_MODE ="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `appasionados`
--
CREATE DATABASE `appasionados` DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;
USE `appasionados`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

-- CREATE TABLE IF NOT EXISTS `administrador` (
--   `idAdministrador` int(40) NOT NULL AUTO_INCREMENT,
--   `idRol` int(40) NOT NULL,
--   PRIMARY KEY (`idAdministrador`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `deporte`
--

-- CREATE TABLE IF NOT EXISTS `deporte` (
--   `idDeportes` int(40) NOT NULL AUTO_INCREMENT,
--   `deporte` varchar(40) COLLATE utf8_spanish_ci NOT NULL,
--   PRIMARY KEY (`idDeportes`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dueño`
--

-- CREATE TABLE IF NOT EXISTS `dueño` (
--   `idDueño` int(40) NOT NULL AUTO_INCREMENT,
--   `idRol` int(40) NOT NULL,
--   `Cuit` varchar(40) COLLATE utf8_spanish_ci NOT NULL,
--   `idCancha` int(40) NOT NULL,
--   `idDeporte` int(40) NOT NULL,
--   PRIMARY KEY (`idDueño`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugador`
--

-- CREATE TABLE IF NOT EXISTS `jugador` (
--   `idJugador` int(40) NOT NULL AUTO_INCREMENT,
--   `idRol` int(40) NOT NULL,
--   `Posición` varchar(60) COLLATE utf8_spanish_ci NOT NULL,
--   `idDeporte` int(40) NOT NULL,
--   `idEquipo` int(40) NOT NULL,
--   PRIMARY KEY (`idJugador`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

-- CREATE TABLE IF NOT EXISTS `rol` (
--   `idRol` int(40) NOT NULL AUTO_INCREMENT,
--   `rolUsuario` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
--   PRIMARY KEY (`idRol`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `idUsuarios` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `apellido` varchar(40) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `email` varchar(60) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `nombreUsuario` varchar(80) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `contrasenia` varchar(90) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`idUsuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci AUTO_INCREMENT=1 ;
