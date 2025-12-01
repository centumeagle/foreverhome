CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: abandoned_animals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.abandoned_animals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    desertionno text NOT NULL,
    processstate text,
    kindcd text,
    colorcd text,
    age text,
    weight text,
    sexcd text,
    neuteryn text,
    specialmark text,
    carenm text,
    caretel text,
    careaddr text,
    happendt text,
    happenplace text,
    noticesdt text,
    noticeedt text,
    popfile text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: abandoned_animals abandoned_animals_desertionno_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abandoned_animals
    ADD CONSTRAINT abandoned_animals_desertionno_key UNIQUE (desertionno);


--
-- Name: abandoned_animals abandoned_animals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abandoned_animals
    ADD CONSTRAINT abandoned_animals_pkey PRIMARY KEY (id);


--
-- Name: idx_abandoned_animals_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_abandoned_animals_created_at ON public.abandoned_animals USING btree (created_at DESC);


--
-- Name: idx_abandoned_animals_desertionno; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_abandoned_animals_desertionno ON public.abandoned_animals USING btree (desertionno);


--
-- Name: abandoned_animals update_abandoned_animals_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_abandoned_animals_updated_at BEFORE UPDATE ON public.abandoned_animals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: abandoned_animals Anyone can view abandoned animals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view abandoned animals" ON public.abandoned_animals FOR SELECT USING (true);


--
-- Name: abandoned_animals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.abandoned_animals ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


