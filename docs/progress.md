# WAF voortgang — 2026-11-26
Baseline main 94475ef9843ddebc1ca1daa93560b5b6fd556260; [CI groen](https://github.com/waldokolk-dotcom/waldo-application-factory/actions/runs/45837303043) voor bestaande registry-tests, niet voor productie. Zeven repositories toegankelijk: WAF, open-data-coach, VakantieApp, whatsup-dog, waldo-linkedin-publisher, dirigent, waldo-ai-control-gateway. CAN I’DOE niet als afzonderlijke repo aangetroffen; geen wijzigingen buiten WAF.
Verbindo main cbe6a4c549594adc861dc701536c1810b63cc755; foundation 99587b2b8eec611d123c835a20936fd3ed51e8e9. Foundation package.json bevat nog geen officiële Supabase SDK; profieltrigger aanwezig, RLS en live werking niet bewezen. Geen wijziging in Verbindo wegens afzonderlijke ontwikkeltaak. WAF branch atomisch aangemaakt vanaf main; bij bestaande branch/PR volgende cyclus eerst inspecteren, niet opnieuw aanmaken.
## Mijlpalen
| # | Mijlpaal | Status / bewijs |
|---|---|---|
| 1 | Strategie | Vastgelegd: README/AGENTS |
| 2 | Architectuur | Basis vastgelegd: AGENTS/registers |
| 3 | ChatGPT-instructies | Gebruiker bevestigde instelling; docs/chat-workflow.md |
| 4 | Interactief keuzemenu | Chatprototype; geen centrale werkende UI |
| 5 | Centrale repo | Gereed: private GitHub-repo |
| 6 | Startpakket | Gereed als starter: package.json, theme.css, registry-tests, baseline CI |
| 7 | Auth | Kandidaat 0.1.0, [PR 1](https://github.com/waldokolk-dotcom/waldo-application-factory/pull/1); serveradapter + vijf mocktests; echte SDK-integratie ontbreekt |
| 8 | Database | Gepland; RLS en isolatietests ontbreken |
| 9 | Identiteit | Basis CSS-tokens; geen gevalideerde pakketten |
| 10 | API | Gepland |
| 11 | Verbindo | Primary-reference geregistreerd; migratie niet bewezen |
| 12 | Tweede app | Gepland |
| 13 | Beheeromgeving | Gepland |
| 14 | UX-bibliotheek | Gepland |
| 15 | UX Studio | Chatprototype, geen centrale implementatie |
| 16 | Thema's/schermpatronen | Basis CSS; geen gerenderde validatie |
| 17 | UX Reviewer | Rubric vastgelegd; geen onafhankelijke review |
| 18 | Toegankelijkheid/visuele regressie | Gepland |
| 19 | UX/marketing/visual gates | Standaard vastgelegd; automatische gates ontbreken |
## Cyclusresultaat
Auth-adapter commit 96ac5e18cb64424c462c8a67cd9e9bbe9369fb1b; registry candidate 9604b1de158fdd12787cc461899beb22aa1d0b74. Testcases: server identity, malformed headers, rejected/expired credentials and upstream errors, cross-user ownership, invalid client. CI voor laatste wijziging nog niet bevestigd bij schrijven; geen merge, geen productieclaim. Eerdere CI groen is geen bewijs voor actuele head. Kosten: geen nieuwe verplichtingen aangegaan. UX-standaard gelezen; serveradapter heeft geen scherm; volgende account-UI integratie vereist mobiele/desktop journeys en visuele beoordeling.
## Volgende actie
Controleer exacte PR-head CI en joblogs, herstel zo nodig; controleer actieve Verbindo-run voordat integratie wordt gestart. Verifieer officiële SDK met vastgepinde versie, echte sessievalidatie en RLS, daarna account UX en release gates. Geen productie zonder bewijs. Houd voortgang op deze branch totdat PR gecontroleerd geïntegreerd kan worden.

## Uitvoering WAF 0.2.0 — 26 november 2026

De zes primaire bouwblokken staan nu in de registry als versie 0.1.0 `testing`, met uitvoerbare implementaties voor auth, data, theme, api, quality en release. De WAF-suite telt 16 geslaagde tests, inclusief negatieve authenticatie, cross-owner data-isolatie, begrensde API-invoer en fail-closed releasebewijzen.

Verbindo foundation `feat/verbindo-agent-foundation-20261013` is eerst met actuele `main` verenigd en gebruikt de officiële, exact vastgepinde `@supabase/supabase-js` 2.119.2. Verbindo 8.2.0 integreert server-side `auth.getUser`, bestaande RLS-eigenaarsgrenzen, WAF-tokens, `/api/waf/status`, Node 22 gates en `checksPass` releasebeleid. Lokaal bewijs: 80 tests geslaagd, 1 externe live-test expliciet overgeslagen, alle regressies en 32 UI-structuurchecks groen, dependency-audit 0 bevindingen, desktop en iPhone kernreis groen, mobiele visuele smoke groen op 320/375/390/430 px zonder overflow.

Tijdens de gerenderde test is een bestaande owner-loginbreuk hersteld: de server accepteerde de geldige private sessie, maar de frontend dwong daarna een Supabase-accountredirect af. De clientredirect is verwijderd; serverautorisatie blijft leidend. Geen database-DDL of betaalde dienst toegevoegd. Hosted Supabase-advisors melden nog leaked-password protection uitgeschakeld en een informatieve server-only tabel zonder clientpolicy. Productie en `productionVerified` blijven daarom onbewezen totdat exacte GitHub-headchecks groen zijn, deployment op die commit is bevestigd en de live owner-reis opnieuw is getest.

## Onafhankelijke verificatie — 26 november 2026 20:54 CET
WAF PR 1 merged e4eed664eb1069ecd0d690725dec2070a9183442; exact head 93a2f08a55247362785e9ebb2d8d199250d8f707 [CI success](https://github.com/waldokolk-dotcom/waldo-application-factory/actions/runs/45880986475). Verbindo PR 67 merged 7376334e03ac9fd40ed5207b09e6be8f34be0154; exact head 6873bc2eda4c989fc29966fdeff11bdfd0194042 [release CI](https://github.com/waldokolk-dotcom/open-data-coach/actions/runs/45881800565) and [browser CI](https://github.com/waldokolk-dotcom/open-data-coach/actions/runs/45881800680) success. Render reported live deployment dep-dc48ddg473hc7399qvog on 5e4a441dbcecf07b215adcece07402d18fec268e (20:22 CET). User reported receiving mail. Direct web endpoint fetch unavailable; not evidence of endpoint failure. Added read-only bounded GitHub Actions public API smoke workflow, commit 9fcbb225e2589eae9f202b4aa99c3559e28f5a9b; pending CI. No production modification. All six blocks remain testing, 0/6 fully verified. Milestones 7,8,10,11 now integrated candidates; 9,16 CSS tokens integrated but not full identity packages; 18 browser smoke partial, 19 release gates partial. Other milestone statuses unchanged. Pootgenoten repository latest bd42d53245fcdc8a1c8744b58bd40400c0b910e1 is roadmap baseline; release remains blocked on verified generic auth/data/theme/API/quality/release plus separate location, consent, notification, missing/found and walking-assistance modules. Verbindo separate automation paused. Next: inspect smoke CI, then authenticated journeys, RLS isolation and full contract checks. Costs: no new obligations. UX standard reviewed; no UI changes this cycle.


## 26 november 2026 21:52 CET
PR 2 merged 8d0b215e9c98d516dcf3be89004826ffaa896bd9 after both exact-head checks succeeded: [registry](https://github.com/waldokolk-dotcom/waldo-application-factory/actions/runs/45887203881), [live smoke](https://github.com/waldokolk-dotcom/waldo-application-factory/actions/runs/45887204097). Job steps confirmed npm test and live HTTP/JSON smoke success. This is not full API acceptance. New branch strengthens the live status contract to verify schema, app, factory and block versions and exact deployed commit; CI pending. Verbindo and WhatsUp Dog heads unchanged in commit search. No product modifications, no new costs. All six remain testing; 0/6 fully verified; all 19 milestone statuses retained. Pootgenoten blocked until 6/6; notifications remain a separate dependency. Next: inspect new CI, reconcile any unexpected public/protected endpoint behavior without relaxing access, then authenticated positive/negative tests and RLS. UX standard reviewed; no UI change.

## 26 november 2026 22:50 CET
PR 3 merged 3b93d8fce096a4a130529324227320fde388e164 after exact head 39288076c39d2105a1d4b1dc071c49fbe00d0d87 passed both workflows. [Live contract](https://github.com/waldokolk-dotcom/waldo-application-factory/actions/runs/45894233331) job log confirms HTTP 200 in 0.288028 seconds, JSON schema 1, WAF 0.2.0, Verbindo 8.2.0, six block versions 0.1.0 and exact deployed SHA 5e4a441dbcecf07b215adcece07402d18fec268e. [Registry](https://github.com/waldokolk-dotcom/waldo-application-factory/actions/runs/45894233352) npm test step passed. No product deployment or new costs. Public status endpoint success conflicts with earlier protected-route description; verify intended access boundary. Full API connector acceptance, authenticated account lifecycle, two-user RLS and rollback still unproven; 0/6 fully verified. All 19 milestones retained, API milestone partial live evidence. Pootgenoten remains paused. UX standard reviewed; no screen changes. Next: negative authorization checks on explicitly private routes and authenticated test identities, then RLS isolation. No production changes.
