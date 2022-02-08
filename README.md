# À propos du projet
Metis Calendars est un projet open source sous licence GNU General Public License v3.0 développé par Zinedine GALOUZ pour Sciences Po.
Celui-ci permet de récupérer et d'agréger des emplois du temps à partir de sources multiples.

# Utilisation
Pour choisir les emplois du temps à générer et les sources depuis lesquelles récupérer les calendriers, il faut éditer le fichier **liste.yaml**. Il est possible de hiérarchiser les emplois du temps en sous-dossiers, voir exemple ci-dessous :
```yaml
L1:
  Physique:
    - https://licence.math.univ-paris-diderot.fr/data/6361.ics
    - https://licence.math.univ-paris-diderot.fr/data/6292.ics
  Mathematiques:
    - https://licence.math.univ-paris-diderot.fr/data/6362.ics
    - https://licence.math.univ-paris-diderot.fr/data/6292.ics
L2:
  Physique:
    - https://licence.math.univ-paris-diderot.fr/data/6361.ics
    - https://licence.math.univ-paris-diderot.fr/data/6292.ics
  Mathematiques:
    - https://licence.math.univ-paris-diderot.fr/data/6362.ics
    - https://licence.math.univ-paris-diderot.fr/data/6292.ics
```

# Fonctionnement
## Lecture de liste.yaml
La lecture du fichier de configuration liste.yaml se fait grâce au fichier yamlReader.js. Celui-ci parcourt l'arborescence spécifiée dans le fichier de configuration, crée les dossiers et les fichiers appropriés et génère une structure JSON utilisable par le module de traitement de calendriers.

## Traitement de calendriers
Le traitement de calendriers est géré par le fichier calendarHandler.js. Celui-ci récupère la structure JSON générée par yamlReader et effectue des requêtes HTTP vers les sources demandées. Les fichiers ical résultants sont générés par agrégation des sources et un fichier all.ical agrégeant toutes les sources est également généré.