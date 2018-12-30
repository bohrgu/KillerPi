#!/bin/sh

db_file_name='db_init_file'
touch $db_file_name

# table to store all possible challenges of the killer game
# french contract example: "Bonjour {killer}, tu vas devoir tuer {victim} en le/la faisant {challenge}."
echo 'CREATE TABLE CHALLENGE(UUID TEXT PRIMARY KEY NOT NULL, DESCRIPTION TEXT NOT NULL);' >> $db_file_name
echo "INSERT INTO CHALLENGE VALUES ('57911f48-3d85-44e8-a21b-c9bdbaa2f506', 'chanter la marseillaise');" >> $db_file_name
echo "INSERT INTO CHALLENGE VALUES ('8cf326fe-0e3e-4402-9427-ddfbdc8dffdc', 'sauter à cloche pied');" >> $db_file_name
echo "INSERT INTO CHALLENGE VALUES ('69e6ff3c-bf63-44ac-a3bc-37faff5faf3f', 'faire 3 pompes');" >> $db_file_name
echo "INSERT INTO CHALLENGE VALUES ('da1af7e2-b80a-46e7-bb46-759f2133c1e9', 'boire ton verre cul sec');" >> $db_file_name
echo "INSERT INTO CHALLENGE VALUES ('7e3e1ff9-b1be-44b8-9313-032d8bd9cb5d', 'dire \"vive les lapins\"');" >> $db_file_name
echo "INSERT INTO CHALLENGE VALUES ('28e45d12-84b9-4245-adb1-5e16ed2799c4', 'raconter une blague de Toto');" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('1c4a6bbc-c69a-4c1f-b52b-b4b03934f6ee', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('53661c09-b19f-4602-8043-a4737850f4c6', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('58d3a5cc-dd3f-48f4-9ae2-16494bdad239', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('d8629e4a-fb5f-4acf-96e8-13d96a05fa9f', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('52733e2c-cd48-4676-83b3-b7ddf0ee8294', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('43bb0cf9-b99d-4953-8e99-908b8b9caa7d', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('04267c32-d9d3-4dfb-b787-9f689c3d331f', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('4fd029db-6bcb-406b-a1e7-45fb650fad39', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('ae2622e7-b91e-4fb9-89d8-ab5f8a388a10', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('259a439b-eb67-455e-827c-d6c1bbef3935', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('53b90f20-7f65-459f-bcf6-cf1f19faec42', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('55b1d379-af12-45cd-9932-2c063ccec766', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('407832db-3be0-4955-a984-1627a01b8d0f', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('e24ff22b-026e-4294-b882-fb5bddaacb1a', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('eb1fbd52-4a08-404d-ac37-1be8e2496b94', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('78f65af1-8533-4b6a-9e73-aa13652e4f73', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('7b0efd0e-f9ba-4210-923e-4f1b3911d126', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('590767b6-2e44-4b8e-b4e8-0c64e8b805b9', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('748e107a-407b-4cc6-b25c-012a796981d3', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('660ba298-9963-439c-bb79-ccef43256c30', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('cce622ad-534f-4228-949e-d113d338b231', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('cb9c7f68-a3fe-40b9-b7ee-43f1ceca2e69', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('62ca4b34-5d3a-4216-93bb-190e2ae21dbe', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('a11a5d75-069e-4b9a-9a1b-8b6485cc628f', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('89fc7d5b-3606-4803-a82c-4caeec90cc29', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('c7f6f73b-7d6c-4a23-8a76-076a9ea018d2', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('4be5a4b9-b668-49a8-b56a-253e38e70872', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('75268b58-d9d6-41d4-8348-92ae6d4987b0', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('3d77ac9a-71f5-4094-bd4b-c5f894458d4f', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('52ff210d-aade-468a-804c-1db1985dea3b', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('2a781004-ad92-45a7-b93a-7988725a1335', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('5d583cc9-6292-4db2-b548-dea8f00f380d', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('85584315-165a-451e-ae54-cb70248637fe', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('51e22901-f359-40d1-b2e1-3b015752e13e', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('65236f41-2cf3-4c52-8f4b-be431f699a67', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('871d617b-44ba-49bc-b20c-e7ab9aa77ec2', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('d950b1f3-f590-4824-9cdb-adab7aa0c163', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('6343e82b-7d01-4781-be5e-7f4370878b94', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('820ca311-1b9b-4694-8eb5-27fa88fa3db0', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('b3044f0e-3124-41b1-982d-c9f5a35cbb9f', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('b1365966-5eca-4304-8867-c077ee5dc5e0', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('78f360b6-dc51-4a0c-8820-e744c736afe7', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('5b5e5c3f-7e4a-4ea1-ab84-f68e7c3655d5', );" >> $db_file_name
#echo "INSERT INTO CHALLENGE VALUES ('847d1da2-6854-42e3-9ace-01c0bab9f108', );" >> $db_file_name

# table to store killer games
# the 'code' is a security system to prevent users from joining the wrong party
echo 'CREATE TABLE GAME(UUID TEXT PRIMARY KEY NOT NULL, CREATION_DATE TEXT NOT NULL, NAME TEXT NOT NULL, OWNER_EMAIL TEXT NOT NULL, END_DATE TEXT NOT NULL, STATUS TEXT NOT NULL, CODE TEXT NOT NULL);' >> $db_file_name
#GAME.STATUS: PENDING, ACTIVE, ENDED

# table to store users
# the 'code' is a security system to verify an attempt to fulfill a contract
echo 'CREATE TABLE USER(UUID TEXT PRIMARY KEY NOT NULL, CREATION_DATE TEXT NOT NULL, GAME_UUID TEXT NOT NULL, FIRST_NAME TEXT NOT NULL, LAST_NAME TEXT NOT NULL, EMAIL TEXT NOT NULL, CODE TEXT NOT NULL);' >> $db_file_name

# table to link players by contracts in the current game
# french contract example: "Bonjour {killer}, tu vas devoir tuer {victim} en le/la faisant {challenge}."
echo 'CREATE TABLE CONTRACT(UUID TEXT PRIMARY KEY NOT NULL, CREATION_DATE TEXT NOT NULL, GAME_UUID TEXT NOT NULL, KILLER_UUID TEXT NOT NULL, VICTIM_UUID TEXT NOT NULL, CHALLENGE_UUID TEXT NOT NULL, STATUS TEXT NOT NULL);' >> $db_file_name
#CONTRACT.STATUS: ACTIVE, SUCCESS, FAILURE, ENDED

# table to store attempts to fulfill a contract
echo 'CREATE TABLE ATTEMPT(UUID TEXT PRIMARY KEY NOT NULL, CREATION_DATE TEXT NOT NULL, KILLER_UUID TEXT NOT NULL, VICTIM_UUID TEXT NOT NULL, STATUS TEXT NOT NULL);' >> $db_file_name
#ATTEMPT.STATUS: SUCCESS, FAILURE

#cat $db_file_name
sqlite3 -init $db_file_name Killer.db
rm -f $db_file_name
