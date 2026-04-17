<script setup>
const scores = [100, 80, 63, 50, 41, 34, 29, 24, 19, 15, 12, 9, 7, 6, 5];
</script>

<template>
  <main>
    <div class="wrapper wrapper-sm">
      <section class="text-section">
        <h1>Spelregels</h1>

        <h2>Regels</h2>

        <p>
          Het klinkt heel simpel om bij RondeMaestro de beste te zijn: je moet

          de meeste punten halen. Maar hoe haal je die punten?
        </p>

        <p>
          Om punten te kunnen halen moet je allereerst renners selecteren.

          Acht om precies te zijn. Dat mogen uiteraard elke keer dezelfde

          namen zijn, maar je mag ook per wedstrijd je team volledig omgooien.

          Als je in elk geval uiterlijk op de wedstrijddag voor 12.00 uur je

          selectie instuurt!
        </p>

        <p>
          Aan het eind van de etappe zullen de RondeMaestro's de rekenkamer in duiken om zodoende de uitslag te bepalen.
          Die uitslag zal in ieder
          geval voor 23.00 uur bekend worden gemaakt.
        </p>

        <p>
          De punten worden verdeeld aan de hand van de volgende

          verdeelsleutel:
        </p>

        <table class="score-table">
          <caption>Puntenverdeling RondeMaestro</caption>
          <thead>
            <tr class="header">
              <th><strong>Plaats</strong></th>
              <th><strong>Punten</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(score, index) in scores" :key="index">
              <td>{{ index + 1 }}.</td>
              <td>{{ score }}</td>
            </tr>
          </tbody>
        </table>

        <p>
          Mocht er een renner - om wat voor reden dan ook - later dan elf uur
          ‘s avonds nog uit de officiële uitslagen worden geschrapt, dan
          verandert dat niks meer aan de uitslag van RondeMaestro. Die blijft
          voor eeuwig zoals ‘ie was om 23.00 uur.
        </p>

        <h3>Hoe bepalen we de winnaar van de dag?</h3>
        <p>
          Dat is natuurlijk de grote vraag! Want als iedereen z'n acht toppers heeft ingestuurd en de etappe is
          gereden, dan willen we weten: wie was vandaag de beste voorspeller? Nou, daar hebben we een slim
          rekenmachientje voor geschreven – eentje die niet alleen naar punten kijkt, maar ook een beetje naar wie er
          het snelst bij was.
        </p>

        <h4>Zo werkt het:</h4>
        <p>
          Als de etappe is gereden, bepalen we wie de <strong>beste voorspeller van de dag</strong> is. Dit is de som
          van punten die je gekozen renners hebben behaald we door middel van de bovenstaande tabel. Bij een gelijke
          stand in punten kijken we naar de volgende criteria om een winnaar aan te wijzen:
        </p>

        <ol>
          <li>
            <strong>Aantal juiste renners:</strong> Dan kijken we naar wie de meeste renners in de top 15 heeft
            voorspeld.
          </li>
          <li>
            <strong>Laagste totaalpositie:</strong> Is er dan nog geen beslissing? Dan kijken we naar de opgetelde
            eindposities van deze renners. Hoe lager dit totaal, hoe beter.
          </li>
          <li>
            <strong>Tijd van inzenden:</strong> Is de stand dan nog steeds gelijk? Dan wint de deelnemer die zijn of
            haar team het <strong>vroegst</strong> heeft ingestuurd. Wie het snelst zijn huiswerk af had, pakt de
            dagzege.
          </li>
        </ol>

        <h2>Einduitslag</h2>
        <p>
          Bij klassiekers is het allemaal vrij simpel: er wordt een koers
          gereden en aan het einde van die wedstrijd is er een winnaar van
          zowel die wedstrijd als de wedstrijd der voorspellers. Maar een
          grote ronde bestaat niet uit één ritje. Daarom wordt aan het einde
          van zowel de Giro d’Italia, de Tour de France en de Vuelta a España
          nog een laatste keer naar het algemeen klassement gekeken. De
          persoon die dan het meeste punten heeft behaald wint de grote ronde!
        </p>
        <p>
          Mocht er onverhoopt sprake zijn van een gelijk aantal punten, dan
          wordt er gekeken naar wie de meeste eerste plaatsen heeft veroverd
          in daguitslagen. Is dat ook ex aequo? Dan wordt er gekeken naar
          tweede plaatsen. Of derde plaatsen. Enzovoorts.
        </p>
        <p>
          Degene die over het hele jaar gezien het meeste punten heeft gehaald
          wint eeuwige roem aan de toog of bij de koffieautomaten. Wat wil een
          mens nog meer!
        </p>
      </section>
    </div>
  </main>
</template>
