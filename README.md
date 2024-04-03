# Trigger_Mesh

## Strona tytułowa

**Akronim:** TM  
**Tytył:** Trigger Mesh  
**Autorzy:** Krzysiek Miśkowicz, Michał Kiełkowski, Paweł Steczkiewicz, Sebastain Misztal  
**Rok, Grupa:** 2024 Grupa 6

## Wstęp

TriggerMesh jest oprogramowaniem, które zapewnia gwarancję dostawy at-least-once:

- Zdarzenia przechodzące przez TriggerMesh nie są tracone w przypadku restartu usługi lub maszyny, dzięki trwałości zapewnianej przez Brokera Redis.
- Komponenty źródłowe potwierdzają odbiór zdarzenia producentom eventów (w stosownych przypadkach) dopiero po bezpiecznym potwierdzeniu eventu przez Brokera. Na przykład SQSSource powie SQS, aby usunął zdarzenie z kolejki dopiero wtedy, gdy Broker potwierdzi jego odebranie.
- Brokerzy zapewniają, dostarczanie eventów klientom zewnętrznym za pośrednictwem komponentów Target. Oznacza to, że pod pewnymi warunkami ponowią próbę wysłania eventów, a także użyją utraconych wiadomości do zapisania eventów, których nie udało się dostarczyć. Te zachowania można skonfigurować w triggerach.
- Konsumenci zdarzeń mogą potencjalnie odbierać eventy więcej niż raz. To od konsumentów zależy, czy będą idempotentni, co oznacza, że skutki zduplikowanego eventu albo nie powodują skutków ubocznych, albo zduplikowane komunikaty są ignorowane.

## Podłoże teoretyczne

TriggerMesh umożliwia przechwytywanie eventów za pomocą sources, kierowanie i przekształcanie ich za pomocą transformations, brokers i triggers oraz dostarczanie ich konsumentom za pomocą Targets. TriggerMesh zapewnia ujednoliconą obsługę zdarzeń, co oznacza, że wszystkie zdarzenia mogą być scentralizowane w jednym brokerze przy użyciu wspólnego formatu zwanego CloudEvents.

### Events

W TriggerMesh event jest opisywane przy użyciu wspólnego formatu, który definiuje strukturę i opis metadanych zdarzeń.

Format jest oparty na podzbiorze specyfikacji CloudEvents. TriggerMesh obsługuje format JSON CloudEvents i używa HTTP protocol binding do transportu CloudEvents przez HTTP.

### Sources

Sources są źródłem danych i eventów. Mogą one działać lokalnie lub w chmurze. Przykładami są bazy danych, kolejki komunikatów, dzienniki i zdarzenia z aplikacji lub usług.

### Broker, Trigger i Filter

TriggerMesh zapewnia Brokera, który działa jako pośrednik między producentami wydarzeń a konsumentami, oddzielając ich od siebie i zapewniając gwarancje dostawy, aby mieć pewność, że żadne wydarzenia nie zostaną utracone po drodze. Brokerzy zachowują się jak magistrala zdarzeń, co oznacza, że wszystkie zdarzenia są buforowane razem jako grupa.

Triggery służą do określenia, które zdarzenia trafiają do poszczególnych celów. Wyzwalacz jest dołączony do brokera i zawiera filtr określający, które zdarzenia powinny spowodować uruchomienie triggera. Filtry te opierają się na metadanych zdarzeń lub zawartości ładunku. Jeśli trigger zostanie uruchomiony, wysyła zdarzenie do celu zdefiniowanego w triggerze.

### Target

Targets są miejscem docelowym przetwarzanych zdarzeń lub danych. Przykładami są bazy danych, kolejki komunikatów, systemy monitorowania i usługi w chmurze.

### Transformation

Transformations to zbiór modyfikacji nadchodzących wydarzeń. Przykładami może być dodawanie adnotacji do przychodzących zdarzeń za pomocą timestampów, usuwanie pól lub zmienianie kolejności danych w celu dopasowania do oczekiwanego formatu.

### Komponenty TriggerMesh

Główną funkcjonalność TriggerMesh zapewniają poszczególne komponenty, takie jak Brokery, Sources, Targets i Transformations. Każdy komponent jest kontenerem, który można deklaratywnie skonfigurować w celu dostosowania jego zachowania. Na przykład source SQS przyjmuje jako konfigurację kolejkę SQS ARN. Brokerzy są najbardziej złożonymi z tych kontenerów: zawierają triggery i mają opcję wsparcia przez Redis w celu zapewnienia trwałości wydarzenia.

Istnieją dwa interfejsy użytkownika, których można używać do konfigurowania i uruchamiania komponentów TriggerMesh.

tmctl to interfejs wiersza poleceń, który umożliwia łatwą konfigurację komponentów w sposób przyjazny dla programistów, a także uruchamia kontenery na komputerze za pomocą Dockera.

Komponenty TriggerMesh mogą również działać natywnie na platformie Kubernetes. Jest to możliwe dzięki custom resource definitions (CRD) i kontrolerom TriggerMesh. Każdy komponent TriggerMesh ma swój własny CRD. Sources, targets, transformations i inne korzystają z jednego kontrolera, a broker ma własny kontroler.

Komponenty TriggerMesh komunikują się poprzez sieć zgodnie ze standardem CloudEvents. CloudEvents zapewniają standardową kopertę dla zdarzeń, co oznacza, że można nimi manipulować w jednolity sposób: routing, transformations itp. stają się możliwe niezależnie od tego, skąd pochodzi event.

CloudEvents zawiera również protocol bindings, które regulują sposób, w jaki komponenty mogą wymieniać zdarzenia w sieci. Wewnątrz TriggerMesh zdarzenia są wymieniane przy użyciu HTTP protocol binding CloudEvents.


### Przykładowe komendy:

-tmctl send-event <your_message>
  <img src="https://github.com/mkiel01/Trigger_Mesh/blob/main/img/send_event.png" alt="website"/>
  
-tmctl create transformation --source <your_source>
  <img src="https://github.com/mkiel01/Trigger_Mesh/blob/main/img/create_transformation.png" alt="website"/>


## Stack technologiczny

TriggerMesh, Kubernetes, Docker

## Opis przykładowego zastosowania

### Problem:

Rozważmy scenariusz, w którym istnieją Aplikacja A i Aplikacja B. Te aplikacje, ze względu na różne cykle rozwojowe lub zależności, mogą działać na różnych wersjach. Koordynowanie zdarzeń między nimi, zapewnienie spójności danych i wyzwalanie działań na podstawie określonych warunków zapewni nam rozwiązanie TriggerMesh.

### Przegląd rozwiązania:

TriggerMesh działa jako warstwa pośrednia, przechwytując zdarzenia generowane przez Aplikację A i efektywnie przesyłając je do Aplikacji B (i na odwrót), niezależnie od różnic w wersjach. Zapewnia scentralizowany system zarządzania zdarzeniami, umożliwiając płynną komunikację między zróżnicowanymi wersjami aplikacji.

### Podsumowanie:

TriggerMesh rewolucjonizuje architekturę opartą na zdarzeniach, eliminując luki między aplikacjami działającymi na różnych wersjach. Jego solidne funkcje i elastyczny design umożliwiają deweloperom budowanie skalowalnych, interoperacyjnych systemów, odblokowując nowe możliwości płynnej integracji w nowoczesnych środowiskach oprogramowania.

### Źródła:

-https://www.triggermesh.com/

-https://docs.triggermesh.io/

-https://www.youtube.com/watch?v=eybEtJMipNE