--
-- PostgreSQL database dump
--

\restrict raKRInUbPsCBIa39OXzwiBM4rg7ciGoh9At4N8uyLU04a5harbey6X2O8lgywuY

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: BlogCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogCategory" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BlogCategory" OWNER TO postgres;

--
-- Name: BlogComment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogComment" (
    id text NOT NULL,
    "postId" text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    website text,
    content text NOT NULL,
    "isApproved" boolean DEFAULT false NOT NULL,
    "isSpam" boolean DEFAULT false NOT NULL,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BlogComment" OWNER TO postgres;

--
-- Name: BlogPost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogPost" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text NOT NULL,
    "featuredImage" text,
    images text[],
    "categoryId" text,
    "authorId" text NOT NULL,
    "cityId" text,
    "metaTitle" text,
    "metaDescription" text,
    "metaKeywords" text,
    status text DEFAULT 'draft'::text NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "publishedAt" timestamp(3) without time zone
);


ALTER TABLE public."BlogPost" OWNER TO postgres;

--
-- Name: BlogTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogTag" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BlogTag" OWNER TO postgres;

--
-- Name: Booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Booking" (
    id text NOT NULL,
    "tourId" text NOT NULL,
    "customerName" text NOT NULL,
    "customerEmail" text NOT NULL,
    "customerPhone" text,
    "travelDate" timestamp(3) without time zone NOT NULL,
    "numberOfPeople" integer NOT NULL,
    "totalPrice" numeric(10,2) NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "paymentStatus" text DEFAULT 'unpaid'::text NOT NULL,
    "specialRequests" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "guestId" text
);


ALTER TABLE public."Booking" OWNER TO postgres;

--
-- Name: BookingDriver; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BookingDriver" (
    id text NOT NULL,
    "bookingId" text NOT NULL,
    "driverId" text NOT NULL,
    "vehicleId" text
);


ALTER TABLE public."BookingDriver" OWNER TO postgres;

--
-- Name: BookingGuide; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BookingGuide" (
    id text NOT NULL,
    "bookingId" text NOT NULL,
    "guideId" text NOT NULL,
    role text
);


ALTER TABLE public."BookingGuide" OWNER TO postgres;

--
-- Name: City; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."City" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    country text DEFAULT 'Uzbekistan'::text NOT NULL,
    latitude numeric(10,8),
    longitude numeric(11,8),
    image text,
    images text[],
    "metaTitle" text,
    "metaDescription" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."City" OWNER TO postgres;

--
-- Name: Contact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Contact" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    subject text,
    message text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Contact" OWNER TO postgres;

--
-- Name: Driver; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Driver" (
    id text NOT NULL,
    name text NOT NULL,
    phone text,
    "licenseNumber" text,
    languages text[],
    notes text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Driver" OWNER TO postgres;

--
-- Name: Guest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Guest" (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    phone text,
    country text,
    "preferredLanguage" text DEFAULT 'ru'::text,
    "totalBookings" integer DEFAULT 0 NOT NULL,
    "totalSpent" numeric(10,2) DEFAULT 0 NOT NULL,
    "lastBookingAt" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Guest" OWNER TO postgres;

--
-- Name: Guide; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Guide" (
    id text NOT NULL,
    name text NOT NULL,
    phone text,
    email text,
    languages text[],
    notes text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Guide" OWNER TO postgres;

--
-- Name: ItineraryItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ItineraryItem" (
    id text NOT NULL,
    "tourId" text NOT NULL,
    day integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    activities text[],
    meals text[],
    accommodation text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ItineraryItem" OWNER TO postgres;

--
-- Name: Lead; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lead" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    source text,
    status text DEFAULT 'new'::text NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    notes text,
    "convertedToBookingId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastContactedAt" timestamp(3) without time zone
);


ALTER TABLE public."Lead" OWNER TO postgres;

--
-- Name: Redirect; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Redirect" (
    id text NOT NULL,
    "fromPath" text NOT NULL,
    "toPath" text NOT NULL,
    "statusCode" integer DEFAULT 301 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Redirect" OWNER TO postgres;

--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id text NOT NULL,
    "tourId" text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    country text,
    rating integer NOT NULL,
    title text,
    comment text NOT NULL,
    images text[],
    "isApproved" boolean DEFAULT false NOT NULL,
    "isSpam" boolean DEFAULT false NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: Setting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Setting" (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    type text DEFAULT 'string'::text NOT NULL,
    "group" text DEFAULT 'general'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Setting" OWNER TO postgres;

--
-- Name: Tour; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tour" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    "shortDescription" text,
    price numeric(10,2) NOT NULL,
    duration integer NOT NULL,
    "maxGroupSize" integer,
    difficulty text,
    "categoryId" text NOT NULL,
    images text[],
    highlights text[],
    included text[],
    excluded text[],
    "metaTitle" text,
    "metaDescription" text,
    "metaKeywords" text,
    "showPrice" boolean DEFAULT true NOT NULL,
    "discountedPrice" numeric(10,2),
    "isActive" boolean DEFAULT true NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "publishedAt" timestamp(3) without time zone
);


ALTER TABLE public."Tour" OWNER TO postgres;

--
-- Name: TourCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TourCategory" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    image text,
    icon text,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TourCategory" OWNER TO postgres;

--
-- Name: TourFaq; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TourFaq" (
    id text NOT NULL,
    "tourId" text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TourFaq" OWNER TO postgres;

--
-- Name: TourInquiry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TourInquiry" (
    id text NOT NULL,
    "tourId" text,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    message text NOT NULL,
    "travelDate" timestamp(3) without time zone,
    "numberOfPeople" integer,
    budget numeric(10,2),
    status text DEFAULT 'new'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TourInquiry" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    avatar text,
    bio text,
    "isActive" boolean DEFAULT true NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "resetToken" text,
    "resetTokenExpiry" timestamp(3) without time zone
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Vehicle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vehicle" (
    id text NOT NULL,
    "driverId" text NOT NULL,
    "plateNumber" text NOT NULL,
    make text NOT NULL,
    model text NOT NULL,
    year integer,
    color text,
    capacity integer,
    type text DEFAULT 'sedan'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Vehicle" OWNER TO postgres;

--
-- Name: _BlogPostToBlogTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_BlogPostToBlogTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_BlogPostToBlogTag" OWNER TO postgres;

--
-- Name: _CityItineraryItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_CityItineraryItem" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_CityItineraryItem" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: BlogCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogCategory" (id, name, slug, description, image, "createdAt", "updatedAt") FROM stdin;
cmjbkup4t000ip39dmpl2nnqt	Travel Tips	travel-tips	Practical advice for traveling in Uzbekistan	\N	2025-12-18 15:10:27.005	2025-12-18 15:10:27.005
\.


--
-- Data for Name: BlogComment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogComment" (id, "postId", name, email, website, content, "isApproved", "isSpam", "parentId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogPost" (id, title, slug, excerpt, content, "featuredImage", images, "categoryId", "authorId", "cityId", "metaTitle", "metaDescription", "metaKeywords", status, "viewCount", "createdAt", "updatedAt", "publishedAt") FROM stdin;
cmjbkup4y000kp39d42gsepgv	Top 10 Things to Do in Samarkand	top-10-things-samarkand	Discover must-see sights and hidden gems of the legendary Silk Road city.	<h2>Introduction</h2><p>Samarkand is a treasure trove of Islamic architecture. Here are the top experiences you shouldn't miss.</p>	https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=800&fit=crop	{}	cmjbkup4t000ip39dmpl2nnqt	cmjbkup2r0000p39d6lyhmxl7	cmjbkup3n0005p39dbo2pqcej	\N	\N	\N	published	2	2025-12-18 15:10:27.01	2025-12-18 17:42:17.388	2025-12-18 15:10:27.009
cmjboo6r00006p3sfx5b1c595	Discover Samarkand: The Pearl of the Silk Road	discover-samarkand-pearl-silk-road	Explore the ancient city of Samarkand, one of the most beautiful cities along the historic Silk Road.	<h2>Welcome to Samarkand</h2><p>Samarkand is one of the oldest continuously inhabited cities in Central Asia. With its stunning architecture and rich history, it's a must-visit destination.</p><h3>Top Attractions</h3><ul><li>Registan Square</li><li>Shah-i-Zinda</li><li>Gur-e-Amir Mausoleum</li></ul>	http://localhost:4000/uploads/blog/1766242132889-gehaio.webp	{}	\N	cmjbocd1z0002p3sfil7tp2iv	\N	Discover Samarkand - Complete Travel Guide 2025	Everything you need to know about visiting Samarkand, the pearl of the Silk Road.	samarkand, uzbekistan, silk road, travel guide, registan	published	1	2025-12-18 16:57:21.709	2025-12-20 14:53:14.752	2025-12-18 16:57:21.708
\.


--
-- Data for Name: BlogTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogTag" (id, name, slug, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Booking" (id, "tourId", "customerName", "customerEmail", "customerPhone", "travelDate", "numberOfPeople", "totalPrice", status, "paymentStatus", "specialRequests", notes, "createdAt", "updatedAt", "guestId") FROM stdin;
cmjecobin0002p3cy0hmslxaq	cmjbkup47000ap39de68wji7i	Test Customer	customer@test.com	+998901234567	2026-03-15 00:00:00	2	2598.00	confirmed	unpaid	Test booking	\N	2025-12-20 13:44:51.024	2025-12-20 18:25:41.507	\N
cmjea5f2u000fp3pngn1b41iy	cmjbocd560004p3sf7cuc8nwd	John Doe	john@example.com	+998 90 123 45 67	2025-12-28 00:00:00	3	2598.00	confirmed	paid	Vegetarian meals please	\N	2025-12-20 12:34:09.943	2025-12-21 10:00:15.747	\N
cmjdyt3gx000cp3pnzq6n5ci1	cmjbocd560004p3sf7cuc8nwd	John Smith	john.smith@example.com	+998901234567	2025-12-26 00:00:00	2	2598.00	pending	unpaid	We would like a room with a view	\N	2025-12-20 07:16:39.249	2025-12-21 10:00:27.993	\N
cmjfdoy3v0002p32lzt3oj457	cmjbkup4e000cp39dscsuno7d	odil jaha	od@od.com	+9985454	2025-12-27 00:00:00	2	1098.00	cancelled	unpaid	vegfyt food	\N	2025-12-21 07:01:06.092	2025-12-21 10:00:35.529	cmjfdoy3n0000p32lueu6i1xz
\.


--
-- Data for Name: BookingDriver; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BookingDriver" (id, "bookingId", "driverId", "vehicleId") FROM stdin;
cmjfdoy5j0006p32lu0pps1ah	cmjfdoy3v0002p32lzt3oj457	cmjfbsej30003p3y7jhdlmu87	\N
\.


--
-- Data for Name: BookingGuide; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BookingGuide" (id, "bookingId", "guideId", role) FROM stdin;
cmjfdoy4x0004p32l1gkxz99x	cmjfdoy3v0002p32lzt3oj457	cmjfbrw450000p3y7bjiwc55y	\N
\.


--
-- Data for Name: City; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."City" (id, name, slug, description, country, latitude, longitude, image, images, "metaTitle", "metaDescription", "createdAt", "updatedAt") FROM stdin;
cmjbkup3n0005p39dbo2pqcej	Samarkand	samarkand	The Pearl of the East - home to stunning Islamic architecture including Registan Square.	Uzbekistan	39.65420000	66.95970000	https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop	{https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop}	\N	\N	2025-12-18 15:10:26.964	2025-12-18 15:10:26.964
cmjbkup3u0006p39d06da8gil	Bukhara	bukhara	UNESCO World Heritage site with over 140 architectural monuments.	Uzbekistan	39.77470000	64.42860000	https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop	{}	\N	\N	2025-12-18 15:10:26.97	2025-12-18 15:10:26.97
cmjbkup3y0007p39dofx1gd5z	Khiva	khiva	Open-air museum city with perfectly preserved old town (Itchan Kala).	Uzbekistan	41.37750000	60.36410000	https://images.unsplash.com/photo-1512690459411-b9245f6eb793?w=800&h=600&fit=crop	{}	\N	\N	2025-12-18 15:10:26.974	2025-12-18 15:10:26.974
cmjbkup420008p39dg5jzo8oa	Tashkent	tashkent	Capital of Uzbekistan, blending modern development with historical monuments.	Uzbekistan	41.29950000	69.24010000	https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop	{}	\N	\N	2025-12-18 15:10:26.978	2025-12-18 15:10:26.978
\.


--
-- Data for Name: Contact; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Contact" (id, name, email, phone, subject, message, status, "createdAt", "updatedAt") FROM stdin;
cmjdys6dx0000p3pn3ayscf51	John Doe	john@example.com	+998901234567	Inquiry	Hello, I am interested in your tours to Uzbekistan.	new	2025-12-20 07:15:56.372	2025-12-20 07:15:56.372
cmjdysu4k0004p3pn73wp1421	Test User	test1@example.com	\N	\N	This is test message number 1 for rate limiting.	new	2025-12-20 07:16:27.141	2025-12-20 07:16:27.141
cmjdysue20005p3pnzbryxq0j	Test User	test2@example.com	\N	\N	This is test message number 2 for rate limiting.	new	2025-12-20 07:16:27.483	2025-12-20 07:16:27.483
cmjdysunb0006p3pn8r56nbo0	Test User	test3@example.com	\N	\N	This is test message number 3 for rate limiting.	new	2025-12-20 07:16:27.815	2025-12-20 07:16:27.815
cmjdysuwj0007p3pn57l6u05w	Test User	test4@example.com	\N	\N	This is test message number 4 for rate limiting.	new	2025-12-20 07:16:28.148	2025-12-20 07:16:28.148
cmjdysv5u0008p3pnxv7psytp	Test User	test5@example.com	\N	\N	This is test message number 5 for rate limiting.	new	2025-12-20 07:16:28.483	2025-12-20 07:16:28.483
cmjdysvf40009p3pnwhx3tgsf	Test User	test6@example.com	\N	\N	This is test message number 6 for rate limiting.	new	2025-12-20 07:16:28.817	2025-12-20 07:16:28.817
cmjdysvoc000ap3pndwjx5lh3	Test User	test7@example.com	\N	\N	This is test message number 7 for rate limiting.	new	2025-12-20 07:16:29.149	2025-12-20 07:16:29.149
cmjea4rry000dp3pnpmavb0au	Test User	test@example.com	\N	Test inquiry	This is a test message from the form testing process.	new	2025-12-20 12:33:39.742	2025-12-20 12:33:39.742
cmjecntq20000p3cysq5aa2x7	Test User	test@example.com	\N	\N	Test message	new	2025-12-20 13:44:27.962	2025-12-20 13:44:27.962
\.


--
-- Data for Name: Driver; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Driver" (id, name, phone, "licenseNumber", languages, notes, "isActive", "createdAt", "updatedAt") FROM stdin;
cmjfbs9kq0002p3y72iqezkng	Britanni Vance	+1 (628) 728-9599	313	{en,uz}	Quam quidem est dese	t	2025-12-21 06:07:41.69	2025-12-21 06:07:41.69
cmjfbsej30003p3y7jhdlmu87	Byron Tyson	+1 (433) 581-6248	961	{en,ru}	Ullamco eu unde temp	t	2025-12-21 06:07:48.111	2025-12-21 06:07:48.111
\.


--
-- Data for Name: Guest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Guest" (id, email, name, phone, country, "preferredLanguage", "totalBookings", "totalSpent", "lastBookingAt", notes, "createdAt", "updatedAt") FROM stdin;
cmjfdoy3n0000p32lueu6i1xz	od@od.com	odil jaha	+9985454	\N	ru	1	1098.00	2025-12-21 07:01:06.099	\N	2025-12-21 07:01:06.084	2025-12-21 07:01:06.101
\.


--
-- Data for Name: Guide; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Guide" (id, name, phone, email, languages, notes, "isActive", "createdAt", "updatedAt") FROM stdin;
cmjfbrw450000p3y7bjiwc55y	Ciara Vasquez	+1 (801) 413-5205	ligabebady@mailinator.com	{en,uz}	Deserunt deserunt di	t	2025-12-21 06:07:24.245	2025-12-21 06:07:24.245
cmjfbs30k0001p3y7969ft2v1	Reed Kim	+1 (512) 164-5631	kiriqiv@mailinator.com	{de,fr,en}	Eiusmod sed sint ist	t	2025-12-21 06:07:33.188	2025-12-21 06:07:33.188
\.


--
-- Data for Name: ItineraryItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ItineraryItem" (id, "tourId", day, title, description, activities, meals, accommodation, "createdAt", "updatedAt") FROM stdin;
cmjbkup4i000dp39dug6a3cnj	cmjbkup47000ap39de68wji7i	1	Arrival in Tashkent	Welcome to Uzbekistan! Airport transfer to hotel. Rest and prepare for city tour.	{"Airport transfer","Hotel check-in","Welcome briefing"}	{Dinner}	4-star hotel in Tashkent	2025-12-18 15:10:26.995	2025-12-18 15:10:26.995
cmjbkup4i000ep39dzxcp17sk	cmjbkup47000ap39de68wji7i	2	Tashkent City Tour & Train to Samarkand	Morning Tashkent tour. Visit Independence Square, Chorsu Bazaar. Afternoon train to Samarkand.	{"City tour","Bazaar visit","High-speed train"}	{Breakfast,Lunch}	Hotel in Samarkand	2025-12-18 15:10:26.995	2025-12-18 15:10:26.995
cmjbkup4i000fp39dkl5xl7pg	cmjbkup4e000cp39dscsuno7d	1	Arrival & Registan Square	Arrive in Samarkand. Afternoon visit to Registan Square. Sunset illumination.	{"Hotel check-in","Registan visit","Sunset photos"}	{Breakfast}	Boutique hotel	2025-12-18 15:10:26.995	2025-12-18 15:10:26.995
\.


--
-- Data for Name: Lead; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Lead" (id, name, email, phone, company, source, status, priority, notes, "convertedToBookingId", "createdAt", "updatedAt", "lastContactedAt") FROM stdin;
\.


--
-- Data for Name: Redirect; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Redirect" (id, "fromPath", "toPath", "statusCode", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, "tourId", name, email, country, rating, title, comment, images, "isApproved", "isSpam", "isFeatured", "createdAt", "updatedAt") FROM stdin;
cmjbkup4m000gp39dcwy12k88	cmjbkup47000ap39de68wji7i	Sarah Johnson	sarah.j@example.com	USA	5	Trip of a Lifetime!	This tour exceeded all expectations. Our guide was incredibly knowledgeable. Registan Square at sunset was breathtaking!	{}	t	f	t	2025-12-18 15:10:26.998	2025-12-18 15:10:26.998
cmjbkup4m000hp39dmeybf5t9	cmjbkup47000ap39de68wji7i	Marco Rossi	marco.r@example.com	Italy	5	Incredible Cultural Experience	Uzbekistan is a hidden gem! The architecture is stunning, people are welcoming. Highly recommend!	{}	t	f	f	2025-12-18 15:10:26.998	2025-12-18 15:10:26.998
cmjea7ph2000jp3pnsg7e7eu3	cmjbocd560004p3sf7cuc8nwd	Alice Johnson	alice@example.com	USA	5	Amazing experience	This was truly a wonderful experience. The guides were knowledgeable and the landscapes were breathtaking.	{}	f	f	f	2025-12-20 12:35:56.726	2025-12-20 12:35:56.726
\.


--
-- Data for Name: Setting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Setting" (id, key, value, type, "group", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Tour; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tour" (id, title, slug, description, "shortDescription", price, duration, "maxGroupSize", difficulty, "categoryId", images, highlights, included, excluded, "metaTitle", "metaDescription", "metaKeywords", "showPrice", "discountedPrice", "isActive", "isFeatured", "createdAt", "updatedAt", "publishedAt") FROM stdin;
cmjbkup47000ap39de68wji7i	Classic Uzbekistan: 7-Day Journey	classic-uzbekistan-7-days	Experience the highlights of Uzbekistan. Visit Tashkent, Samarkand, Bukhara, and Khiva. Marvel at stunning Islamic architecture, explore ancient bazaars, and immerse yourself in local culture.	Discover the best of Uzbekistan in one week. From Registan Square to the Ark of Bukhara.	1299.00	7	16	Easy	cmjbkup2x0001p39dnr7i1kki	{https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=800&fit=crop,https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=800&fit=crop,https://images.unsplash.com/photo-1512690459411-b9245f6eb793?w=1200&h=800&fit=crop}	{"Registan Square in Samarkand","Gur-e-Amir Mausoleum","Ark of Bukhara","Itchan Kala in Khiva","Traditional Uzbek cuisine","Local bazaars and handicrafts"}	{"All accommodation (3-4 star hotels)","All breakfasts and some meals","Professional English-speaking guide","All entrance fees","Comfortable AC transportation","High-speed train tickets"}	{"International flights","Visa fees","Travel insurance","Personal expenses",Tips}	Classic Uzbekistan Tour - 7 Days | Jahongir Travel	Explore Silk Road cities on our Classic 7-day tour. Visit Tashkent, Samarkand, Bukhara, Khiva.	\N	t	\N	t	t	2025-12-18 15:10:26.983	2025-12-18 15:10:26.983	2025-12-18 15:10:26.981
cmjbkup4e000cp39dscsuno7d	Samarkand Highlights: 3-Day Exploration	samarkand-highlights-3-days	Dive deep into Samarkand history. This focused tour explores magnificent monuments at a relaxed pace.	Spend 3 days exploring the Pearl of the East.	549.00	3	12	Easy	cmjbkup330002p39dilejb4je	{https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=800&fit=crop}	{"Registan Square","Shah-i-Zinda necropolis","Bibi-Khanym Mosque","Ulugh Beg Observatory","Siab Bazaar"}	{"2 nights boutique hotel","Daily breakfast","Expert local guide","All entrance fees","Airport transfers"}	{"Lunch and dinner","Personal expenses",Tips}	\N	\N	\N	t	\N	t	t	2025-12-18 15:10:26.991	2025-12-18 15:10:26.991	2025-12-18 15:10:26.99
cmjbocd560004p3sf7cuc8nwd	Silk Road Explorer	silk-road-explorer-test	Experience the magic of the Silk Road with our comprehensive 7-day tour.	Discover the ancient Silk Road cities of Uzbekistan	1299.00	7	12	Easy	cmjbocd4l0003p3sfvo6alxwv	\N	{"Visit Registan Square in Samarkand","Explore Bukhara old city","See Khiva ancient walls"}	{"Accommodation in 4-star hotels","All breakfasts and dinners","Professional English-speaking guide"}	{"International flights","Personal expenses","Optional activities"}	Silk Road Explorer Tour - 7 Days	Join our 7-day Silk Road Explorer tour through Uzbekistan historic cities.	\N	t	1099.00	t	f	2025-12-18 16:48:10.123	2025-12-19 15:00:29.939	\N
\.


--
-- Data for Name: TourCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TourCategory" (id, name, slug, description, image, icon, "order", "isActive", "createdAt", "updatedAt") FROM stdin;
cmjbkup2x0001p39dnr7i1kki	Cultural Tours	cultural-tours	Explore the rich cultural heritage of Uzbekistan, from ancient Silk Road cities to traditional crafts.	https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop	🏛️	1	t	2025-12-18 15:10:26.937	2025-12-18 15:10:26.937
cmjbkup330002p39dilejb4je	Historical Tours	historical-tours	Journey through millennia of history, visiting ancient monuments and UNESCO sites.	https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop	🕌	2	t	2025-12-18 15:10:26.943	2025-12-18 15:10:26.943
cmjbkup390003p39dkpgf5fxj	Adventure Tours	adventure-tours	Trekking, hiking, and outdoor adventures in mountains and deserts.	https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop	🏔️	3	t	2025-12-18 15:10:26.949	2025-12-18 15:10:26.949
cmjbkup3h0004p39dtrgjujmb	Family Tours	family-tours	Family-friendly tours for travelers of all ages.	https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop	👨‍👩‍👧‍👦	4	t	2025-12-18 15:10:26.958	2025-12-18 15:10:26.958
cmjbmmbkv0001p31eba9lrxcu	Cultural Tours	cultural-tours-test	Explore Uzbekistan heritage and culture	\N	🏛️	5	t	2025-12-18 15:59:55.411	2025-12-18 15:59:55.411
cmjbocd4l0003p3sfvo6alxwv	Adventure Tours	adventure-tours-test	Exciting adventure tours in Uzbekistan	\N	🏔️	1	t	2025-12-18 16:48:10.1	2025-12-18 16:48:10.1
\.


--
-- Data for Name: TourFaq; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TourFaq" (id, "tourId", question, answer, "order", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TourInquiry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TourInquiry" (id, "tourId", name, email, phone, message, "travelDate", "numberOfPeople", budget, status, "createdAt", "updatedAt") FROM stdin;
cmjbpy8b60001p3yprfhqn1a7	cmjbocd560004p3sf7cuc8nwd	John Doe	john.doe@example.com	+998901234567	I'm interested in booking the "Silk Road Explorer" tour. Please provide more information.	2025-12-25 00:00:00	1	1299.00	new	2025-12-18 17:33:09.906	2025-12-18 17:33:09.906
cmjdysem50001p3pn91ju3a94	\N	Alice Smith	alice@example.com	\N	I would like to know more about the Silk Road tour packages	2025-06-15 00:00:00	4	\N	new	2025-12-20 07:16:07.037	2025-12-20 07:16:07.037
cmjea7d09000hp3pn0g7dta2s	cmjbocd560004p3sf7cuc8nwd	Jane Smith	jane@example.com	+998 91 234 56 78	I am interested in a custom tour to Bukhara and Samarkand. Can you provide details?	2025-03-15 00:00:00	4	3000.00	new	2025-12-20 12:35:40.569	2025-12-20 12:35:40.569
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, role, avatar, bio, "isActive", "emailVerified", "createdAt", "updatedAt", "lastLoginAt", "resetToken", "resetTokenExpiry") FROM stdin;
cmjbkup2r0000p39d6lyhmxl7	Admin User	admin@jahongir-travel.uz	$2b$10$9htYkTonHZ65PgmAKPrAZODPNDtm/na9ZfypPoXZTRAv6vZ6iVofu	admin	\N	\N	t	t	2025-12-18 15:10:26.932	2025-12-18 15:10:26.932	\N	\N	\N
cmjbocd1z0002p3sfil7tp2iv	Admin User	admin@jahongir.uz	$2b$10$wNHOut3CfRv6KxjeM.tjZ.TDk7Au3KuhzrD4t0FmdX99EsYEBY72u	admin	\N	\N	t	f	2025-12-18 16:48:10.007	2025-12-18 16:48:10.007	\N	\N	\N
\.


--
-- Data for Name: Vehicle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vehicle" (id, "driverId", "plateNumber", make, model, year, color, capacity, type, "isActive", notes, "createdAt", "updatedAt") FROM stdin;
cmjfkvncj0001p3w3ejp1f5ss	cmjfbsej30003p3y7jhdlmu87	702	Omnis ut quisquam il	Alias magnam eum ex 	2001	Quod veniam qui ex 	35	sedan	t	Doloribus fuga Cumq	2025-12-21 10:22:16.051	2025-12-21 10:22:16.051
cmjfkvyxo0003p3w3jzz26e3t	cmjfbs9kq0002p3y72iqezkng	386	Eiusmod aute delectu	Consectetur atque v	1995	Quos omnis veniam a	37	minivan	t	Culpa sequi aut vol	2025-12-21 10:22:31.068	2025-12-21 10:22:31.068
cmjfkwa6u0005p3w3kvblsyua	cmjfbsej30003p3y7jhdlmu87	203	Et sequi et corrupti	Vel vitae excepteur 	2010	Saepe aperiam laudan	28	sedan	t	Est elit occaecat 	2025-12-21 10:22:45.654	2025-12-21 10:22:45.654
cmjfkx4hq0007p3w3laa3h84g	cmjfbsej30003p3y7jhdlmu87	30AS555DF	GM	Volga	2026	Wgite	8	minivan	t	very good car	2025-12-21 10:23:24.926	2025-12-21 10:23:24.926
\.


--
-- Data for Name: _BlogPostToBlogTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_BlogPostToBlogTag" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _CityItineraryItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_CityItineraryItem" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d3c1298d-2d40-4a6c-ad83-781e2a904b61	98659ebe22e75fa2e7edbbf2b99383e7f382c92398ed4fb1ab2d7638a9ddc88c	2025-12-18 15:10:15.309875+00	20251218064124_init	\N	\N	2025-12-18 15:10:14.966942+00	1
2fddf0e1-76f2-4f05-a7d5-4237d2aa1549	49ad460dc99b685e444444c6c6a95f62f666bd7df94db1d7441118e331bb26bc	2025-12-20 17:53:50.629695+00	20251220175350_add_guest_model	\N	\N	2025-12-20 17:53:50.583397+00	1
c37ba2d5-c4a0-4a30-848e-be747bcdbb54	86841c66a2f88de40f7235d18c2f40e7e123c66132e07b55a785dbbbe78c267b	2025-12-21 05:48:39.412951+00	20251221054839_add_guides_drivers	\N	\N	2025-12-21 05:48:39.330107+00	1
\.


--
-- Name: BlogCategory BlogCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogCategory"
    ADD CONSTRAINT "BlogCategory_pkey" PRIMARY KEY (id);


--
-- Name: BlogComment BlogComment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogComment"
    ADD CONSTRAINT "BlogComment_pkey" PRIMARY KEY (id);


--
-- Name: BlogPost BlogPost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY (id);


--
-- Name: BlogTag BlogTag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogTag"
    ADD CONSTRAINT "BlogTag_pkey" PRIMARY KEY (id);


--
-- Name: BookingDriver BookingDriver_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookingDriver"
    ADD CONSTRAINT "BookingDriver_pkey" PRIMARY KEY (id);


--
-- Name: BookingGuide BookingGuide_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookingGuide"
    ADD CONSTRAINT "BookingGuide_pkey" PRIMARY KEY (id);


--
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- Name: City City_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_pkey" PRIMARY KEY (id);


--
-- Name: Contact Contact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_pkey" PRIMARY KEY (id);


--
-- Name: Driver Driver_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT "Driver_pkey" PRIMARY KEY (id);


--
-- Name: Guest Guest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guest"
    ADD CONSTRAINT "Guest_pkey" PRIMARY KEY (id);


--
-- Name: Guide Guide_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guide"
    ADD CONSTRAINT "Guide_pkey" PRIMARY KEY (id);


--
-- Name: ItineraryItem ItineraryItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ItineraryItem"
    ADD CONSTRAINT "ItineraryItem_pkey" PRIMARY KEY (id);


--
-- Name: Lead Lead_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lead"
    ADD CONSTRAINT "Lead_pkey" PRIMARY KEY (id);


--
-- Name: Redirect Redirect_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Redirect"
    ADD CONSTRAINT "Redirect_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: Setting Setting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Setting"
    ADD CONSTRAINT "Setting_pkey" PRIMARY KEY (id);


--
-- Name: TourCategory TourCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourCategory"
    ADD CONSTRAINT "TourCategory_pkey" PRIMARY KEY (id);


--
-- Name: TourFaq TourFaq_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourFaq"
    ADD CONSTRAINT "TourFaq_pkey" PRIMARY KEY (id);


--
-- Name: TourInquiry TourInquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourInquiry"
    ADD CONSTRAINT "TourInquiry_pkey" PRIMARY KEY (id);


--
-- Name: Tour Tour_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tour"
    ADD CONSTRAINT "Tour_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Vehicle Vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY (id);


--
-- Name: _BlogPostToBlogTag _BlogPostToBlogTag_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogPostToBlogTag"
    ADD CONSTRAINT "_BlogPostToBlogTag_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _CityItineraryItem _CityItineraryItem_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CityItineraryItem"
    ADD CONSTRAINT "_CityItineraryItem_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: BlogCategory_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogCategory_slug_idx" ON public."BlogCategory" USING btree (slug);


--
-- Name: BlogCategory_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BlogCategory_slug_key" ON public."BlogCategory" USING btree (slug);


--
-- Name: BlogComment_isApproved_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogComment_isApproved_idx" ON public."BlogComment" USING btree ("isApproved");


--
-- Name: BlogComment_postId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogComment_postId_idx" ON public."BlogComment" USING btree ("postId");


--
-- Name: BlogPost_authorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogPost_authorId_idx" ON public."BlogPost" USING btree ("authorId");


--
-- Name: BlogPost_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogPost_categoryId_idx" ON public."BlogPost" USING btree ("categoryId");


--
-- Name: BlogPost_publishedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogPost_publishedAt_idx" ON public."BlogPost" USING btree ("publishedAt");


--
-- Name: BlogPost_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogPost_slug_idx" ON public."BlogPost" USING btree (slug);


--
-- Name: BlogPost_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BlogPost_slug_key" ON public."BlogPost" USING btree (slug);


--
-- Name: BlogPost_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogPost_status_idx" ON public."BlogPost" USING btree (status);


--
-- Name: BlogTag_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BlogTag_name_key" ON public."BlogTag" USING btree (name);


--
-- Name: BlogTag_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BlogTag_slug_idx" ON public."BlogTag" USING btree (slug);


--
-- Name: BlogTag_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BlogTag_slug_key" ON public."BlogTag" USING btree (slug);


--
-- Name: BookingDriver_bookingId_driverId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BookingDriver_bookingId_driverId_key" ON public."BookingDriver" USING btree ("bookingId", "driverId");


--
-- Name: BookingDriver_bookingId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BookingDriver_bookingId_idx" ON public."BookingDriver" USING btree ("bookingId");


--
-- Name: BookingDriver_driverId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BookingDriver_driverId_idx" ON public."BookingDriver" USING btree ("driverId");


--
-- Name: BookingDriver_vehicleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BookingDriver_vehicleId_idx" ON public."BookingDriver" USING btree ("vehicleId");


--
-- Name: BookingGuide_bookingId_guideId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BookingGuide_bookingId_guideId_key" ON public."BookingGuide" USING btree ("bookingId", "guideId");


--
-- Name: BookingGuide_bookingId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BookingGuide_bookingId_idx" ON public."BookingGuide" USING btree ("bookingId");


--
-- Name: BookingGuide_guideId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BookingGuide_guideId_idx" ON public."BookingGuide" USING btree ("guideId");


--
-- Name: Booking_customerEmail_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Booking_customerEmail_idx" ON public."Booking" USING btree ("customerEmail");


--
-- Name: Booking_guestId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Booking_guestId_idx" ON public."Booking" USING btree ("guestId");


--
-- Name: Booking_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Booking_status_idx" ON public."Booking" USING btree (status);


--
-- Name: Booking_tourId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Booking_tourId_idx" ON public."Booking" USING btree ("tourId");


--
-- Name: City_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "City_slug_idx" ON public."City" USING btree (slug);


--
-- Name: City_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "City_slug_key" ON public."City" USING btree (slug);


--
-- Name: Contact_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Contact_email_idx" ON public."Contact" USING btree (email);


--
-- Name: Contact_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Contact_status_idx" ON public."Contact" USING btree (status);


--
-- Name: Driver_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Driver_isActive_idx" ON public."Driver" USING btree ("isActive");


--
-- Name: Driver_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Driver_name_idx" ON public."Driver" USING btree (name);


--
-- Name: Guest_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Guest_createdAt_idx" ON public."Guest" USING btree ("createdAt");


--
-- Name: Guest_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Guest_email_idx" ON public."Guest" USING btree (email);


--
-- Name: Guest_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Guest_email_key" ON public."Guest" USING btree (email);


--
-- Name: Guest_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Guest_name_idx" ON public."Guest" USING btree (name);


--
-- Name: Guest_totalBookings_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Guest_totalBookings_idx" ON public."Guest" USING btree ("totalBookings");


--
-- Name: Guide_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Guide_isActive_idx" ON public."Guide" USING btree ("isActive");


--
-- Name: Guide_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Guide_name_idx" ON public."Guide" USING btree (name);


--
-- Name: ItineraryItem_day_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ItineraryItem_day_idx" ON public."ItineraryItem" USING btree (day);


--
-- Name: ItineraryItem_tourId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ItineraryItem_tourId_idx" ON public."ItineraryItem" USING btree ("tourId");


--
-- Name: Lead_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lead_email_idx" ON public."Lead" USING btree (email);


--
-- Name: Lead_priority_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lead_priority_idx" ON public."Lead" USING btree (priority);


--
-- Name: Lead_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lead_status_idx" ON public."Lead" USING btree (status);


--
-- Name: Redirect_fromPath_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Redirect_fromPath_idx" ON public."Redirect" USING btree ("fromPath");


--
-- Name: Redirect_fromPath_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Redirect_fromPath_key" ON public."Redirect" USING btree ("fromPath");


--
-- Name: Review_isApproved_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Review_isApproved_idx" ON public."Review" USING btree ("isApproved");


--
-- Name: Review_rating_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Review_rating_idx" ON public."Review" USING btree (rating);


--
-- Name: Review_tourId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Review_tourId_idx" ON public."Review" USING btree ("tourId");


--
-- Name: Setting_group_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Setting_group_idx" ON public."Setting" USING btree ("group");


--
-- Name: Setting_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Setting_key_idx" ON public."Setting" USING btree (key);


--
-- Name: Setting_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Setting_key_key" ON public."Setting" USING btree (key);


--
-- Name: TourCategory_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TourCategory_order_idx" ON public."TourCategory" USING btree ("order");


--
-- Name: TourCategory_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TourCategory_slug_idx" ON public."TourCategory" USING btree (slug);


--
-- Name: TourCategory_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TourCategory_slug_key" ON public."TourCategory" USING btree (slug);


--
-- Name: TourFaq_tourId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TourFaq_tourId_idx" ON public."TourFaq" USING btree ("tourId");


--
-- Name: TourInquiry_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TourInquiry_createdAt_idx" ON public."TourInquiry" USING btree ("createdAt");


--
-- Name: TourInquiry_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TourInquiry_email_idx" ON public."TourInquiry" USING btree (email);


--
-- Name: TourInquiry_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TourInquiry_status_idx" ON public."TourInquiry" USING btree (status);


--
-- Name: TourInquiry_tourId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TourInquiry_tourId_idx" ON public."TourInquiry" USING btree ("tourId");


--
-- Name: Tour_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Tour_categoryId_idx" ON public."Tour" USING btree ("categoryId");


--
-- Name: Tour_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Tour_isActive_idx" ON public."Tour" USING btree ("isActive");


--
-- Name: Tour_isFeatured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Tour_isFeatured_idx" ON public."Tour" USING btree ("isFeatured");


--
-- Name: Tour_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Tour_slug_idx" ON public."Tour" USING btree (slug);


--
-- Name: Tour_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tour_slug_key" ON public."Tour" USING btree (slug);


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_resetToken_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_resetToken_idx" ON public."User" USING btree ("resetToken");


--
-- Name: User_resetToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_resetToken_key" ON public."User" USING btree ("resetToken");


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: Vehicle_driverId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Vehicle_driverId_idx" ON public."Vehicle" USING btree ("driverId");


--
-- Name: Vehicle_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Vehicle_isActive_idx" ON public."Vehicle" USING btree ("isActive");


--
-- Name: Vehicle_plateNumber_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Vehicle_plateNumber_idx" ON public."Vehicle" USING btree ("plateNumber");


--
-- Name: Vehicle_plateNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Vehicle_plateNumber_key" ON public."Vehicle" USING btree ("plateNumber");


--
-- Name: _BlogPostToBlogTag_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_BlogPostToBlogTag_B_index" ON public."_BlogPostToBlogTag" USING btree ("B");


--
-- Name: _CityItineraryItem_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_CityItineraryItem_B_index" ON public."_CityItineraryItem" USING btree ("B");


--
-- Name: BlogComment BlogComment_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogComment"
    ADD CONSTRAINT "BlogComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."BlogComment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BlogComment BlogComment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogComment"
    ADD CONSTRAINT "BlogComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."BlogPost"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BlogPost BlogPost_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BlogPost BlogPost_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."BlogCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BlogPost BlogPost_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BookingDriver BookingDriver_bookingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookingDriver"
    ADD CONSTRAINT "BookingDriver_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES public."Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BookingDriver BookingDriver_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookingDriver"
    ADD CONSTRAINT "BookingDriver_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BookingDriver BookingDriver_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookingDriver"
    ADD CONSTRAINT "BookingDriver_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BookingGuide BookingGuide_bookingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookingGuide"
    ADD CONSTRAINT "BookingGuide_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES public."Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BookingGuide BookingGuide_guideId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookingGuide"
    ADD CONSTRAINT "BookingGuide_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES public."Guide"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Booking Booking_guestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES public."Guest"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Booking Booking_tourId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES public."Tour"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ItineraryItem ItineraryItem_tourId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ItineraryItem"
    ADD CONSTRAINT "ItineraryItem_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES public."Tour"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_tourId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES public."Tour"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TourFaq TourFaq_tourId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourFaq"
    ADD CONSTRAINT "TourFaq_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES public."Tour"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TourInquiry TourInquiry_tourId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TourInquiry"
    ADD CONSTRAINT "TourInquiry_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES public."Tour"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Tour Tour_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tour"
    ADD CONSTRAINT "Tour_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."TourCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Vehicle Vehicle_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BlogPostToBlogTag _BlogPostToBlogTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogPostToBlogTag"
    ADD CONSTRAINT "_BlogPostToBlogTag_A_fkey" FOREIGN KEY ("A") REFERENCES public."BlogPost"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BlogPostToBlogTag _BlogPostToBlogTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogPostToBlogTag"
    ADD CONSTRAINT "_BlogPostToBlogTag_B_fkey" FOREIGN KEY ("B") REFERENCES public."BlogTag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _CityItineraryItem _CityItineraryItem_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CityItineraryItem"
    ADD CONSTRAINT "_CityItineraryItem_A_fkey" FOREIGN KEY ("A") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _CityItineraryItem _CityItineraryItem_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CityItineraryItem"
    ADD CONSTRAINT "_CityItineraryItem_B_fkey" FOREIGN KEY ("B") REFERENCES public."ItineraryItem"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict raKRInUbPsCBIa39OXzwiBM4rg7ciGoh9At4N8uyLU04a5harbey6X2O8lgywuY

