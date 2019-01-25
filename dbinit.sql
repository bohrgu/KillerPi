-- table to store all possible "Challenge"s of the killer game
-- french contract example: "Bonjour {killer}, tu vas devoir tuer {victim} en le/la faisant {"Challenge"}."
CREATE TABLE Challenge(UUID TEXT PRIMARY KEY NOT NULL, DESCRIPTION TEXT NOT NULL);
INSERT INTO "Challenge" VALUES ('57911f48-3d85-44e8-a21b-c9bdbaa2f506', 'chanter la marseillaise');

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
