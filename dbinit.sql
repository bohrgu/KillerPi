-- table to store all possible "Challenge"s of the killer game
-- french contract example: "Bonjour {killer}, tu vas devoir tuer {victim} en le/la faisant {"Challenge"}."
CREATE TABLE Challenge(UUID TEXT PRIMARY KEY NOT NULL, DESCRIPTION TEXT NOT NULL);
INSERT INTO "Challenge" VALUES ('57911f48-3d85-44e8-a21b-c9bdbaa2f506', 'chanter la marseillaise');
INSERT INTO "Challenge" VALUES ('8cf326fe-0e3e-4402-9427-ddfbdc8dffdc', 'sauter à cloche pied');
INSERT INTO "Challenge" VALUES ('69e6ff3c-bf63-44ac-a3bc-37faff5faf3f', 'faire 3 pompes');
INSERT INTO "Challenge" VALUES ('da1af7e2-b80a-46e7-bb46-759f2133c1e9', 'boire ton verre cul sec');
INSERT INTO "Challenge" VALUES ('7e3e1ff9-b1be-44b8-9313-032d8bd9cb5d', 'dire \"vive les lapins\"');
INSERT INTO "Challenge" VALUES ('28e45d12-84b9-4245-adb1-5e16ed2799c4', 'raconter une blague de Toto');
--INSERT INTO "Challenge" VALUES ('1c4a6bbc-c69a-4c1f-b52b-b4b03934f6ee', );
--INSERT INTO "Challenge" VALUES ('53661c09-b19f-4602-8043-a4737850f4c6', );
--INSERT INTO "Challenge" VALUES ('58d3a5cc-dd3f-48f4-9ae2-16494bdad239', );
--INSERT INTO "Challenge" VALUES ('d8629e4a-fb5f-4acf-96e8-13d96a05fa9f', );
--INSERT INTO "Challenge" VALUES ('52733e2c-cd48-4676-83b3-b7ddf0ee8294', );
--INSERT INTO "Challenge" VALUES ('43bb0cf9-b99d-4953-8e99-908b8b9caa7d', );
--INSERT INTO "Challenge" VALUES ('04267c32-d9d3-4dfb-b787-9f689c3d331f', );
--INSERT INTO "Challenge" VALUES ('4fd029db-6bcb-406b-a1e7-45fb650fad39', );
--INSERT INTO "Challenge" VALUES ('ae2622e7-b91e-4fb9-89d8-ab5f8a388a10', );
--INSERT INTO "Challenge" VALUES ('259a439b-eb67-455e-827c-d6c1bbef3935', );
--INSERT INTO "Challenge" VALUES ('53b90f20-7f65-459f-bcf6-cf1f19faec42', );
--INSERT INTO "Challenge" VALUES ('55b1d379-af12-45cd-9932-2c063ccec766', );
--INSERT INTO "Challenge" VALUES ('407832db-3be0-4955-a984-1627a01b8d0f', );
--INSERT INTO "Challenge" VALUES ('e24ff22b-026e-4294-b882-fb5bddaacb1a', );
--INSERT INTO "Challenge" VALUES ('eb1fbd52-4a08-404d-ac37-1be8e2496b94', );
--INSERT INTO "Challenge" VALUES ('78f65af1-8533-4b6a-9e73-aa13652e4f73', );
--INSERT INTO "Challenge" VALUES ('7b0efd0e-f9ba-4210-923e-4f1b3911d126', );
--INSERT INTO "Challenge" VALUES ('590767b6-2e44-4b8e-b4e8-0c64e8b805b9', );
--INSERT INTO "Challenge" VALUES ('748e107a-407b-4cc6-b25c-012a796981d3', );
--INSERT INTO "Challenge" VALUES ('660ba298-9963-439c-bb79-ccef43256c30', );
--INSERT INTO "Challenge" VALUES ('cce622ad-534f-4228-949e-d113d338b231', );
--INSERT INTO "Challenge" VALUES ('cb9c7f68-a3fe-40b9-b7ee-43f1ceca2e69', );
--INSERT INTO "Challenge" VALUES ('62ca4b34-5d3a-4216-93bb-190e2ae21dbe', );
--INSERT INTO "Challenge" VALUES ('a11a5d75-069e-4b9a-9a1b-8b6485cc628f', );
--INSERT INTO "Challenge" VALUES ('89fc7d5b-3606-4803-a82c-4caeec90cc29', );
--INSERT INTO "Challenge" VALUES ('c7f6f73b-7d6c-4a23-8a76-076a9ea018d2', );
--INSERT INTO "Challenge" VALUES ('4be5a4b9-b668-49a8-b56a-253e38e70872', );
--INSERT INTO "Challenge" VALUES ('75268b58-d9d6-41d4-8348-92ae6d4987b0', );
--INSERT INTO "Challenge" VALUES ('3d77ac9a-71f5-4094-bd4b-c5f894458d4f', );
--INSERT INTO "Challenge" VALUES ('52ff210d-aade-468a-804c-1db1985dea3b', );
--INSERT INTO "Challenge" VALUES ('2a781004-ad92-45a7-b93a-7988725a1335', );
--INSERT INTO "Challenge" VALUES ('5d583cc9-6292-4db2-b548-dea8f00f380d', );
--INSERT INTO "Challenge" VALUES ('85584315-165a-451e-ae54-cb70248637fe', );
--INSERT INTO "Challenge" VALUES ('51e22901-f359-40d1-b2e1-3b015752e13e', );
--INSERT INTO "Challenge" VALUES ('65236f41-2cf3-4c52-8f4b-be431f699a67', );
--INSERT INTO "Challenge" VALUES ('871d617b-44ba-49bc-b20c-e7ab9aa77ec2', );
--INSERT INTO "Challenge" VALUES ('d950b1f3-f590-4824-9cdb-adab7aa0c163', );
--INSERT INTO "Challenge" VALUES ('6343e82b-7d01-4781-be5e-7f4370878b94', );
--INSERT INTO "Challenge" VALUES ('820ca311-1b9b-4694-8eb5-27fa88fa3db0', );
--INSERT INTO "Challenge" VALUES ('b3044f0e-3124-41b1-982d-c9f5a35cbb9f', );
--INSERT INTO "Challenge" VALUES ('b1365966-5eca-4304-8867-c077ee5dc5e0', );
--INSERT INTO "Challenge" VALUES ('78f360b6-dc51-4a0c-8820-e744c736afe7', );
--INSERT INTO "Challenge" VALUES ('5b5e5c3f-7e4a-4ea1-ab84-f68e7c3655d5', );
--INSERT INTO "Challenge" VALUES ('847d1da2-6854-42e3-9ace-01c0bab9f108', );

-- table to store killer games
-- the 'party_code' is a system to prevent players from joining the wrong party
CREATE TABLE Game(UUID TEXT PRIMARY KEY NOT NULL, CREATION_DATE TEXT NOT NULL, NAME TEXT NOT NULL, OWNER_EMAIL TEXT NOT NULL, END_DATE TEXT NOT NULL, STATUS TEXT NOT NULL, PARTY_CODE TEXT NOT NULL, MASTER_CODE TEXT NOT NULL);
--GAME.STATUS: 'PENDING', 'ACTIVE', 'ENDED'

-- table to store players
-- the 'code' is a security system to verify an attempt to fulfill a contract
CREATE TABLE Player(UUID TEXT PRIMARY KEY NOT NULL, CREATION_DATE TEXT NOT NULL, GAME_UUID TEXT NOT NULL, FIRST_NAME TEXT NOT NULL, LAST_NAME TEXT NOT NULL, EMAIL TEXT NOT NULL, CODE TEXT NOT NULL);

-- table to link players by contracts in the current game
-- french contract example: "Bonjour {killer}, tu vas devoir tuer {victim} en le/la faisant {"Challenge"}."
CREATE TABLE Contract(UUID TEXT PRIMARY KEY NOT NULL, CREATION_DATE TEXT NOT NULL, GAME_UUID TEXT NOT NULL, KILLER_UUID TEXT NOT NULL, VICTIM_UUID TEXT NOT NULL, "Challenge"_UUID TEXT NOT NULL, STATUS TEXT NOT NULL);
--CONTRACT.STATUS: 'ACTIVE', 'FULFILLED', 'FAILED', 'SUICIDE', 'REVOKED', 'ENDED'

-- table to store attempts to fulfill a contract
CREATE TABLE Attempt(UUID TEXT PRIMARY KEY NOT NULL, CREATION_DATE TEXT NOT NULL, GAME_UUID TEXT NOT NULL, KILLER_UUID TEXT NOT NULL, VICTIM_UUID TEXT NOT NULL, STATUS TEXT NOT NULL);
--ATTEMPT.STATUS: 'SUCCESS', 'FAILURE'
