--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

-- Started on 2025-07-11 12:06:23

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 16400)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4825 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16401)
-- Name: event_enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_enrollments (
    id serial NOT NULL,
    id_event integer NOT NULL,
    id_user integer NOT NULL,
    description character varying NOT NULL,
    registration_date_time date NOT NULL,
    attended boolean NOT NULL,
    observations character varying NOT NULL
);


ALTER TABLE public.event_enrollments OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16406)
-- Name: event_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_locations (
    id serial NOT NULL,
    id_location integer NOT NULL,
    name character varying NOT NULL,
    full_adress character varying NOT NULL,
    max_capacity integer NOT NULL,
    latitude integer NOT NULL,
    longitude integer NOT NULL
);


ALTER TABLE public.event_locations OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16411)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id serial NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    id_event_location integer NOT NULL,
    start_date date NOT NULL,
    duration_in_minutes integer NOT NULL,
    price integer NOT NULL,
    enabled_for_enrollment boolean NOT NULL,
    max_assistance integer NOT NULL,
    id_creator_user integer NOT NULL
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16416)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id serial NOT NULL,
    name character varying NOT NULL,
    latitude integer NOT NULL,
    longitude integer NOT NULL,
    id_province integer NOT NULL
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16421)
-- Name: provinces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provinces (
    id serial NOT NULL,
    name character varying NOT NULL,
    full_name character varying NOT NULL,
    latitude integer NOT NULL,
    longitude integer NOT NULL,
    display_order integer NOT NULL
);


ALTER TABLE public.provinces OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16426)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id serial NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4814 (class 0 OID 16401)
-- Dependencies: 215
-- Data for Name: event_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_enrollments VALUES (1, 1, 2, 'Inscripción para la charla de tecnología', '2025-07-05', false, '');
INSERT INTO public.event_enrollments VALUES (2, 2, 1, 'Fan del rock, listo para el concierto', '2025-07-06', true, 'Excelente show');


--
-- TOC entry 4815 (class 0 OID 16406)
-- Dependencies: 216
-- Data for Name: event_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_locations VALUES (1, 1, 'Centro Cultural Recoleta - Auditorio 1', 'Junín 1930, CABA', 150, -34, -58);
INSERT INTO public.event_locations VALUES (2, 2, 'Estadio Único - Sector A', 'Av. 25 y 32, La Plata, Buenos Aires', 5000, -35, -57);


--
-- TOC entry 4816 (class 0 OID 16411)
-- Dependencies: 217
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.events VALUES (1, 'Charla de Tecnología', 'Una charla sobre IA y el futuro', 1, '2025-08-01', 90, 0, true, 100, 1);
INSERT INTO public.events VALUES (2, 'Concierto de Rock', 'Banda en vivo con invitados', 2, '2025-08-10', 120, 3000, true, 5000, 2);


--
-- TOC entry 4817 (class 0 OID 16416)
-- Dependencies: 218
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.locations VALUES (1, 'Centro Cultural Recoleta', -34, -58, 1);
INSERT INTO public.locations VALUES (2, 'Estadio Único de La Plata', -35, -57, 2);


--
-- TOC entry 4818 (class 0 OID 16421)
-- Dependencies: 219
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.provinces VALUES (1, 'CABA', 'Ciudad Autónoma de Buenos Aires', -34, -58, 1);
INSERT INTO public.provinces VALUES (2, 'Buenos Aires', 'Provincia de Buenos Aires', -35, -59, 2);


--
-- TOC entry 4819 (class 0 OID 16426)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'Juan', 'Pérez', 'juanp', 'clave123');
INSERT INTO public.users VALUES (2, 'María', 'Gómez', 'mariag', 'clave456');


--
-- TOC entry 4654 (class 2606 OID 16432)
-- Name: event_enrollments event_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 4656 (class 2606 OID 16434)
-- Name: event_locations event_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4658 (class 2606 OID 16436)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 4660 (class 2606 OID 16438)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4662 (class 2606 OID 16440)
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- TOC entry 4664 (class 2606 OID 16442)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4665 (class 2606 OID 16443)
-- Name: event_enrollments event_enrollments_id_event_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_id_event_fkey FOREIGN KEY (id_event) REFERENCES public.events(id);


--
-- TOC entry 4666 (class 2606 OID 16448)
-- Name: event_enrollments event_enrollments_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id);


--
-- TOC entry 4667 (class 2606 OID 16453)
-- Name: event_locations event_locations_id_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations(id);


--
-- TOC entry 4668 (class 2606 OID 16458)
-- Name: events events_id_creator_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_creator_user_fkey FOREIGN KEY (id_creator_user) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 4669 (class 2606 OID 16463)
-- Name: events events_id_event_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_event_location_fkey FOREIGN KEY (id_event_location) REFERENCES public.locations(id) NOT VALID;


--
-- TOC entry 4670 (class 2606 OID 16468)
-- Name: locations id_provinces; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT id_provinces FOREIGN KEY (id_province) REFERENCES public.provinces(id);


--
-- TOC entry 4826 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-07-11 12:06:24

--
-- PostgreSQL database dump complete
--

