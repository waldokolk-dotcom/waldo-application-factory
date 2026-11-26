# Waldo Application Factory 0.3.0
Centrale ontwikkelstandaard en versiegebonden bouwblokken; Verbindo is de primaire praktijkintegratie. Dit is geen zelfstandig productieplatform.

## Gebruik
- Lees AGENTS.md en docs/chat-workflow.md.
- Raadpleeg registry/blocks.json en registry/apps.json.
- Voer npm test uit met Node 22+. CI is geconfigureerd; controleer de resultaten op GitHub.
- Begin met Verbindo op een afzonderlijke testbranch. Inventariseer auth, routes, datamodel en mail. Test registratie, verificatie, herstel, uitloggen en negatieve toegangstests voordat productie wordt gewijzigd.
- Registreer pas goedgekeurde bouwblokversies na gedocumenteerde tests.

## Grenzen
Geen gedeelde accounts of persoonsgegevens tussen privé- en werkdomeinen. Geen geheimen in Git. Geen betaalde upgrades. Gratis quota vooraf toetsen. Geen automatische productiedeploy in dit starterpakket.

## UX, marketing en visual design (v0.2 standaard)
Volg de [verplichte UX-, marketing- en visuele kwaliteitsstandaard](docs/ux-marketing-visual-standard.md). Deze specificatie voegt zes ontwikkelmijlpalen toe; functionele implementatie en tests zijn nog te verifiëren.

## UX design-bouwblok
`blocks/ux-design` maakt ontwerpbeslissingen herleidbaar naar echte productflows, waaronder Mobbin, en naar openbare design-systemen. Een voorbeeld wordt pas herbruikbaar wanneer de Verbindo-specifieke aanpassing, alle kritieke toestanden en gerenderd testbewijs zijn vastgelegd.
