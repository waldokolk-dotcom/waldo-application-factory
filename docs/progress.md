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
