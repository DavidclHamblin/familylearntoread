/* Family Learn to Read: the stock stories.
   Each book has 10 story pages. {child}, {adult} and {pet} are replaced with the family's names
   (the cast page teaches them, so the checker treats them as names). The child and pet are never
   called he, she or it, so any child and any pet fit. "d" describes the picture for the cartoon service, and "w" gives
   a different outfit on that page (otherwise everyone wears the same clothes in every book).
   tools/check_stories.js checks every page at its stage; run it after any change. */
var FLR = (typeof window !== "undefined" ? (window.FLR = window.FLR || {}) : {});

/* The parts in every book. A family with no pet can use our own stand-in pet. */
FLR.readerRoles = [
  { key: "child", name: "The reader", who: "Your child", label: "Your child's name", example: "Sam", required: true },
  { key: "adult", name: "The grown-up", who: "Mum, Dad, Gran or anyone who reads with them", label: "What your child calls them", example: "Mum", required: true },
  { key: "pet", name: "The pet", who: "Your pet, or our stand-in dog", label: "The pet's name", example: "Biscuit" }
];

FLR.readers = [
  { id: "s3-rain", stage: 3, title: "Fun in the rain", blurb: "Dark clouds, a big hat and lots of mud. Rain is fun!", cast: ["child", "adult", "pet"], pages: [
    { w: { child: "a bright red raincoat with the hood down, blue jeans and red wellington boots" }, t: "It is dark. Rain will fall soon. {child} gets a red coat.", d: "{child} pulls on a red raincoat by the front door while dark clouds gather outside the window; {adult} and {pet} watch." },
    { w: { child: "a bright red raincoat with the hood down, blue jeans and red wellington boots" }, t: "{adult} gets a big hat and {pet} gets wet!", d: "{adult} puts on a huge floppy rain hat; {pet} stands in the open doorway already dripping." },
    { w: { child: "a bright red raincoat with the hood down, blue jeans and red wellington boots" }, t: "Rain hits the roof. Tap, tap, tap!", d: "A cosy house seen from outside, big raindrops bouncing off the roof, {child} looking up from the window." },
    { w: { child: "a bright red raincoat with the hood down, blue jeans and red wellington boots" }, t: "{child} and {adult} go out. Rain is fun!", d: "{child} and {adult} step out into the rain, faces up, laughing, {pet} running ahead." },
    { w: { child: "a bright red raincoat with the hood down, blue jeans and red wellington boots" }, t: "{child} hops in the mud. Mud is on the boots!", d: "{child} hops in a big muddy patch, mud splattered up red wellington boots." },
    { w: { child: "a bright red raincoat with the hood down, blue jeans and red wellington boots" }, t: "{pet} rolls in the mud. Now {pet} is all mud!", d: "{pet} rolls on its back in the mud, completely brown, looking delighted." },
    { w: { child: "a bright red raincoat with the hood down, blue jeans and red wellington boots" }, t: "Look! A duck is in the rain. Quack, quack!", d: "A cheerful duck waddles past in the rain; {child} points at it." },
    { w: { child: "a bright red raincoat with the hood down, blue jeans and red wellington boots" }, t: "The duck has fun in the wet. {child} has fun too.", d: "The duck flaps in a puddle beside {child}, who copies it with arms out like wings." },
    { w: { child: "a bright red raincoat with the hood down, blue jeans and red wellington boots" }, t: "Then the sun is up. The rain has gone.", d: "The sun breaks through the clouds, a rainbow over the garden, everything shining and wet." },
    { t: "{child}, {adult} and {pet} go back in. Mud, mud, mud! A bath for all!", d: "Back indoors, all three are covered in mud; a bubbly bath waits through the bathroom door." }
  ]},
  { id: "s3-fish", stage: 3, title: "The big fish", blurb: "There is a big fish in the park pool. Can {child} get it with a net?", cast: ["child", "adult", "pet"], pages: [
    { t: "{child} and {adult} go to the pool in the park.", d: "{child} and {adult} walk through a sunny park towards a small pond with reeds." },
    { t: "{pet} will go too.", d: "{pet} trots behind them with its tail high." },
    { t: "{child} has a net and a jar.", d: "{child} holds up a little fishing net and an empty glass jar, grinning." },
    { t: "Look in the pool. Fish! A lot of fish!", d: "Looking down into the clear pond: lots of small orange and silver fish." },
    { t: "A big fish is in the weeds. It has a long tail.", d: "A big golden fish with a long flowing tail hides among green water weeds." },
    { t: "{child} dips the net in. Can {child} get the big fish?", d: "{child} kneels at the edge and dips the net into the water, concentrating hard." },
    { t: "No! The fish is too quick. Zip! Zoom!", d: "The big fish darts away in a swirl of bubbles; the net comes up empty." },
    { t: "{pet} looks in the pool. {pet} sees the big fish.", d: "{pet} leans right over the edge, nose almost touching the water, staring at the big fish." },
    { t: "Then {pet} falls in the pool. {pet} is wet!", d: "{pet} tumbles into the shallow pond with a big splash; the fish swims off." },
    { t: "{adult} gets {pet} back. No fish, but lots of fun!", d: "{adult} lifts a soggy {pet} out of the water while {child} laughs." }
  ]},
  { id: "s3-owl", stage: 3, title: "The night owl", blurb: "Hoot, hoot! Who is in the garden at night?", cast: ["child", "adult", "pet"], pages: [
    { w: { child: "cosy blue pyjamas with little stars and slippers" }, t: "It is night. {child} is in bed. {child} hears a hoot.", d: "{child} in bed at night, eyes open, moonlight through the curtains." },
    { w: { child: "cosy blue pyjamas with little stars and slippers" }, t: "Hoot, hoot! {child} gets up to look.", d: "{child} climbs out of bed in pyjamas and tiptoes to the window." },
    { w: { child: "cosy blue pyjamas with little stars and slippers" }, t: "{adult} gets a torch. {child} and {adult} go to the garden.", d: "{adult} holds a torch; {child} and {adult} step quietly into the dark garden." },
    { w: { child: "cosy blue pyjamas with little stars and slippers" }, t: "The moon is big and the garden is dark.", d: "A big full moon over a dark garden full of shadows and a large oak tree." },
    { w: { child: "cosy blue pyjamas with little stars and slippers" }, t: "Hoot! {child} looks up at the oak.", d: "{child} looks up into the branches of the big oak, the torch beam pointing up." },
    { w: { child: "cosy blue pyjamas with little stars and slippers" }, t: "An owl sits on the oak. It looks down at {child}.", d: "A round fluffy owl with big eyes sits on a branch, looking down kindly at {child}." },
    { w: { child: "cosy blue pyjamas with little stars and slippers" }, t: "{pet} barks at the owl. Hush, {pet}!", d: "{pet} looks up at the owl, mouth open; {child} holds a finger to lips." },
    { w: { child: "cosy blue pyjamas with little stars and slippers" }, t: "The owl will not go. It sits and looks at them.", d: "The owl stays calmly on its branch; {child}, {adult} and {pet} gaze up at it." },
    { w: { child: "cosy blue pyjamas with little stars and slippers" }, t: "Then the owl gets up and is off into the night.", d: "The owl flies across the moon, wings wide." },
    { w: { child: "cosy blue pyjamas with little stars and slippers" }, t: "{child} gets back in bed. Hoot, hoot! Good night!", d: "{child} snuggled back in bed, smiling sleepily; the owl is a small shape on the moon outside." }
  ]},
  { id: "s3-farm", stage: 3, title: "Fun at the farm", blurb: "Cows, pigs, chicks, a cheeky goat and a big horse to sit on.", cast: ["child", "adult", "pet"], pages: [
    { t: "{child}, {adult} and {pet} go to a farm.", d: "{child}, {adult} and {pet} arrive at a farm gate with a red barn behind." },
    { t: "A cow is in the shed. Moo! Moo!", d: "A friendly black and white cow pokes its head out of a shed." },
    { t: "A pig is in the mud. {pet} sees the pig.", d: "A pink pig wallows in mud; {pet} stares at it from the fence." },
    { t: "{pet} runs at the pig. The pig runs off!", d: "{pet} dashes towards the pig, which trots away snorting." },
    { t: "A hen has six chicks.", d: "A brown hen with six fluffy yellow chicks around her." },
    { t: "Six chicks! {child} can feed them corn.", d: "{child} crouches and scatters corn; the chicks peck around {child}'s feet." },
    { t: "A goat sees the corn. The goat gets the corn! Bad goat!", d: "A cheeky goat has its head in {child}'s bag of corn." },
    { t: "The farmer has a big horse. {child} can sit on it!", d: "A smiling farmer leads a big gentle horse; {adult} lifts {child} up." },
    { t: "{child} sits high up on the horse. Look at me!", d: "{child} sits proudly on the horse, waving; {adult} and {pet} look up." },
    { t: "Then it is dark. Good night, farm! Good night, all!", d: "Sunset over the farm; the animals settle down as the family waves goodbye." }
  ]},
  { id: "s3-dig", stage: 3, title: "The big dig", blurb: "{child} and {pet} dig in the garden and find a coin from long ago.", cast: ["child", "adult", "pet"], pages: [
    { t: "{child} and {pet} dig in the garden.", d: "{child} with a small spade and a red bucket, {pet} beside, in a garden vegetable patch." },
    { t: "Dig, dig, dig! Soil is on {child}'s feet.", d: "{child} digs hard, soil flying, feet covered in earth." },
    { t: "{pet} digs too. {pet} digs a big pit.", d: "{pet} digs a deep hole with soil spraying out behind." },
    { t: "Look! A coin is in the soil. Is it a king's coin?", d: "{child} holds up a muddy old coin, eyes wide." },
    { t: "{child} digs on. Look, a bit of a pot!", d: "{child} uncovers a piece of an old patterned clay pot." },
    { t: "Then {pet} digs up a big fork.", d: "{pet} proudly pulls an old rusty garden fork out of the ground." },
    { t: "{adult} looks at the coin and the pot.", d: "{adult} examines the coin with a magnifying glass at the garden table, the pot piece beside it." },
    { t: "This coin has a king on it. Wow!", d: "Close-up of the coin showing a king's head; {adult} looks amazed." },
    { t: "{child} puts the coin in a box.", d: "{child} carefully places the coin in a little wooden box lined with cloth." },
    { t: "The coin and the pot go to the town. Now all can see them!", d: "In a small town museum, the coin and pot sit in a glass case; {child} and {pet} look proud." }
  ]},
  { id: "s3-moon", stage: 3, title: "Zoom to the moon", blurb: "A box becomes a rocket, and the moon has a shy little bug.", cast: ["child", "adult", "pet"], pages: [
    { t: "{child} and {pet} get in a box. It is a rocket!", d: "{child} and {pet} sit in a big cardboard box painted like a rocket, in the garden." },
    { t: "Get set. Zoom! Up, up, up!", d: "Imagination: the cardboard rocket blasts off into the sky with a trail of stars." },
    { t: "The rocket zooms up high. Look at the moon!", d: "The rocket flies through space towards a big smiling grey moon." },
    { t: "The rocket gets to the moon. Thud!", d: "The cardboard rocket lands on the moon in a puff of moon dust." },
    { t: "{child} and {pet} hop on the moon. Hop, hop, hop!", d: "{child} and {pet} bounce high in low gravity, laughing." },
    { t: "The moon has big pits. {pet} digs in a pit.", d: "{pet} digs in a moon crater, dust flying." },
    { t: "Look! A moon bug! It is red with six legs.", d: "A cute red six-legged moon bug peeps out of a crater." },
    { t: "The moon bug is shy. It hops in a pit.", d: "The moon bug hops back into its crater, peeking out shyly." },
    { t: "Then {child} hears {adult}. Food is on! Back to the rocket!", d: "A faint voice from Earth; {child} and {pet} hurry back to the rocket." },
    { t: "Zoom! The rocket is back in the garden. Yum, food!", d: "Back in the garden in the cardboard box; {adult} holds out a plate of food, smiling." }
  ]},
  { id: "s3-sheep", stage: 3, title: "Sheep on the road", blurb: "The car has to wait. There are sheep on the road!", cast: ["child", "adult", "pet"], pages: [
    { t: "{child} and {adult} go up the hill in the car. {pet} is in the car too.", d: "A small car winds up a green hill; {child}, {adult} and {pet} inside." },
    { t: "The car has to wait. Sheep are on the road!", d: "The car stops; the road ahead is full of woolly sheep." },
    { t: "Ten sheep! Then a lot of sheep!", d: "More and more sheep pour onto the road from a gap in the wall." },
    { t: "Beep, beep! The sheep will not go.", d: "{adult} beeps the horn; the sheep just stare at the car." },
    { t: "{pet} sees the sheep. {pet} gets out of the car.", d: "{pet} hops out of the car window, ears up." },
    { t: "{pet} runs to the sheep. Off the road, sheep!", d: "{pet} runs round the sheep, herding them towards the hill." },
    { t: "The sheep run up the hill. Good job, {pet}!", d: "The sheep scamper up the hill; {child} cheers from the car." },
    { t: "But six sheep run back! Back on the road!", d: "Six cheeky sheep trot back onto the road, looking pleased with themselves." },
    { t: "A farmer is on the hill. Go up, sheep!", d: "A farmer in a flat cap appears on the hill and waves a crook." },
    { t: "The six sheep go up the hill. Then the car can go too.", d: "The last six sheep follow the farmer; the car drives on, everyone waving." }
  ]},
  { id: "s3-chips", stage: 3, title: "Fish and chips", blurb: "Fish and chips on the wall, and a gull that wants a chip.", cast: ["child", "adult", "pet"], pages: [
    { t: "{child}, {adult} and {pet} go to the chip shop.", d: "A bright seaside chip shop; {child}, {adult} and {pet} walk in." },
    { t: "The chip shop is hot. Chips hiss in the fat.", d: "Behind the counter, chips sizzle in a big fryer with steam rising." },
    { t: "{child} gets fish and chips. {adult} gets a hot dog.", d: "{child} holds a paper parcel of fish and chips; {adult} holds a hot dog." },
    { t: "{child} sits on the wall with the chips.", d: "{child} sits on a low sea wall by the beach, chips open on lap, {pet} beside." },
    { t: "Look! A gull is on the wall. It looks at the chips.", d: "A big seagull lands on the wall, eyeing the chips." },
    { t: "The gull hops near {child}. Go off, gull!", d: "The gull hops closer; {child} shoos it with a hand." },
    { t: "Then six gulls! Gulls on the wall, gulls on the roof!", d: "Seagulls everywhere: on the wall, on the chip shop roof, on a lamp post." },
    { t: "Zoom! A gull gets a chip!", d: "A gull swoops and snatches a chip right from the paper." },
    { t: "{pet} barks. Woof! The gulls are off!", d: "{pet} barks bravely; the gulls fly off in a flurry of feathers." },
    { t: "{child} and {pet} sit on the wall. The chips are good, but hot!", d: "{child} and {pet} share the chips in peace, sea and sunset behind." }
  ]},
  { id: "s3-fair", stage: 3, title: "Fun at the fair", blurb: "Lights, a red horse, a big red bear and a car that zooms down.", cast: ["child", "adult"], pages: [
    { t: "{child} and {adult} go to the fair.", d: "{child} and {adult} arrive at a funfair at dusk, lights twinkling." },
    { t: "The fair has lots of lights. Look at them!", d: "A wide view of the fair: rides, stalls and strings of coloured lights." },
    { t: "{child} sits on a red horse. Up and down, up and down!", d: "{child} rides a red horse on a merry-go-round, grinning." },
    { t: "{child} hooks a duck. A win!", d: "At a hook-a-duck stall, {child} lifts a yellow duck on a hook." },
    { t: "{child} gets a big red bear.", d: "{child} hugs a big red teddy bear prize." },
    { t: "Then {child} and {adult} get in a car on a rail.", d: "{child}, {adult} and the bear sit in a little roller-coaster car." },
    { t: "The car is up high. Then down, down! Zoom!", d: "The roller-coaster car zooms down a dip, hair flying." },
    { t: "{adult} yells! {child} yells too.", d: "{adult} and {child} scream and laugh with arms in the air." },
    { t: "{adult} gets a hot dog. {child} gets a fizzy pop.", d: "At a food stall, {adult} with a hot dog and {child} with a fizzy drink." },
    { t: "It is dark. {child} and the red bear go to bed.", d: "{child} asleep in bed hugging the red bear, fair lights far away through the window." }
  ]},
  { id: "s3-boat", stage: 3, title: "The red boat", blurb: "A red boat, a duck with six chicks, and rain on the lake.", cast: ["child", "adult", "pet"], pages: [
    { t: "{child} and {adult} get in a boat. {pet} gets in too.", d: "A little red rowing boat at a lake jetty; {child}, {adult} and {pet} climb in." },
    { t: "{adult} pulls hard on the oars. {child} looks for fish.", d: "{adult} rows; {child} leans over the side looking into the water." },
    { t: "The boat bobs up and down on the lake.", d: "The red boat bobs on gentle ripples in the middle of a lake with hills around." },
    { t: "Look! A duck and six chicks.", d: "A mother duck and six ducklings paddle past in a line." },
    { t: "A fish pops up. Then it is gone!", d: "A silver fish leaps out of the water near the boat; {pet} stares." },
    { w: { child: "a yellow raincoat over the usual clothes" }, t: "Then it rains. Get a coat, {child}!", d: "Rain starts; {adult} hands {child} a yellow raincoat." },
    { w: { child: "a yellow raincoat over the usual clothes" }, t: "{pet} has no coat. {pet} is wet, wet, wet!", d: "{pet} sits in the boat, soaking wet and looking grumpy." },
    { w: { child: "a yellow raincoat over the usual clothes" }, t: "{adult} turns the boat back. The boat hits a rock. Thud!", d: "The boat bumps a rock near the shore; everyone wobbles." },
    { w: { child: "a yellow raincoat over the usual clothes" }, t: "Is the boat all right? Yes, it is!", d: "{child} checks the side of the boat; no damage, everyone smiles." },
    { w: { child: "a yellow raincoat over the usual clothes" }, t: "Back at the dock. Wet, but good fun!", d: "Back at the jetty, all three drip and laugh; the rain stops and the sun comes out." }
  ]},
  { id: "s4-tent", stage: 4, title: "The tent in the garden", blurb: "A tent, a torch and a night in the garden. But what is that sound?", cast: ["child", "adult", "pet"], pages: [
    { t: "{child} and {adult} got the tent out of the shed. \"Can we camp in the garden?\" said {child}.", d: "{child} and {adult} pull a rolled-up green tent out of a garden shed on a sunny afternoon; {pet} watches." },
    { t: "{adult} held the poles and {child} hammered the pegs in. Bang, bang, bang! The tent went up.", d: "{child} hammers a tent peg with a little mallet while {adult} holds up the tent poles; the tent is half up." },
    { t: "{child} got a sleeping bag, a torch and a big pillow. {pet} got in the tent too.", d: "Inside the little tent: a sleeping bag, a torch and a big pillow; {pet} has already curled up on the pillow." },
    { t: "When it got dark, {adult} lit a lamp. They had hot milk and a snack in the tent.", d: "Dusk in the garden; {adult} and {child} sit in the open tent with a glowing lantern, mugs of hot milk and a plate of biscuits." },
    { t: "Then {child} said, \"I can hear a sound. What is it?\" Crack! Crunch!", d: "Night; {child} sits up in the sleeping bag, eyes wide, holding a torch, listening; shadows of plants on the tent wall." },
    { t: "{adult} got the torch and they went to look. The grass was wet and black.", d: "{child} and {adult} creep across the dark lawn, the torch beam lighting up wet grass." },
    { t: "It was not a monster. It was a hedgehog, munching on a snack in the grass!", d: "The torch beam shows a small hedgehog nibbling in the grass; {child} smiles in surprise." },
    { t: "The hedgehog did not run off. It looked up at {child} and sniffed.", d: "Close-up: the hedgehog looks up at {child}, nose twitching; {child} kneels and keeps very still." },
    { t: "\"Shh, {pet},\" said {child}. \"Do not scare it. It is just a little hedgehog.\"", d: "{child} gently holds {pet} back; the hedgehog trundles off into a flower bed." },
    { t: "Back in the tent, {child} fell asleep with {pet}. What a fun night in the garden!", d: "The tent glowing softly at night; inside, {child} and {pet} asleep together; the moon and stars above the garden." }
  ]},
  { id: "s4-snow", stage: 4, title: "Snow day", blurb: "It snowed in the night! Time for a sledge, a snowman and a snowball or two.", cast: ["child", "adult", "pet"], pages: [
    { w: { child: "a red woolly hat, a thick blue winter coat, mittens and black snow boots" }, t: "{child} looked out of the window. \"Snow!\" said {child}. \"Can we go out and play?\"", d: "{child} in pyjamas presses their nose to a frosty window; outside, the garden is deep in fresh snow." },
    { w: { child: "a red woolly hat, a thick blue winter coat, mittens and black snow boots" }, t: "{child} got a hat, a scarf and a big coat. {adult} got the sledge from the shed.", d: "{child} now in a red woolly hat, scarf and coat; {adult} carries a wooden sledge out of the shed." },
    { w: { child: "a red woolly hat, a thick blue winter coat, mittens and black snow boots" }, t: "They went up the hill in the park. The snow was thick and soft.", d: "{child} and {adult} trudge up a snowy hill pulling the sledge; {pet} bounds ahead in the snow." },
    { w: { child: "a red woolly hat, a thick blue winter coat, mittens and black snow boots" }, t: "{child} sat on the sledge and {adult} gave it a push. Zoom! Down the hill it went.", d: "{child} whizzes down the snowy hill on the sledge, arms up and laughing; {adult} waves from the top." },
    { w: { child: "a red woolly hat, a thick blue winter coat, mittens and black snow boots" }, t: "{pet} ran after the sledge and jumped in the snow. Then {pet} was a snow dog!", d: "{pet} leaps into a snowdrift and comes out covered in white snow from nose to tail." },
    { w: { child: "a red woolly hat, a thick blue winter coat, mittens and black snow boots" }, t: "Next, they rolled a big snowball and then a little one. It was a snowman!", d: "{child} and {adult} roll two big snowballs; a snowman is taking shape." },
    { w: { child: "a red woolly hat, a thick blue winter coat, mittens and black snow boots" }, t: "{child} gave the snowman a carrot nose and a hat. \"He needs a scarf,\" said {child}.", d: "{child} pushes a carrot nose into the snowman's face; it wears an old hat and two pebble eyes." },
    { w: { child: "a red woolly hat, a thick blue winter coat, mittens and black snow boots" }, t: "Then {adult} got hit with a snowball. Splat! \"Who did that?\" said {adult}.", d: "A snowball bursts on {adult}'s shoulder; {adult} spins round, pretending to be cross; {child} hides behind the snowman, giggling." },
    { w: { child: "a red woolly hat, a thick blue winter coat, mittens and black snow boots" }, t: "{child} ran and {adult} ran too. Snowballs went up and down and all over the park!", d: "A happy snowball fight in the park, snowballs flying; {pet} chases them." },
    { t: "Back at home, they had hot chocolate. Their hands and feet were cold. But it was the best day!", d: "In a cosy kitchen, {child} and {adult} wrapped in blankets sip hot chocolate; wet mittens dry on the radiator; {pet} snoozes." }
  ]},
  { id: "s4-shells", stage: 4, title: "Sand and shells", blurb: "Sandcastles, rock pools and a crab that likes to nip.", cast: ["child", "adult", "pet"], pages: [
    { t: "{child}, {adult} and {pet} went to the coast. The sun was hot and the sand was soft.", d: "A sunny sandy beach with gentle waves; {child}, {adult} and {pet} arrive carrying a bucket, spade and towels." },
    { t: "{child} dug in the sand with a spade. \"I will make a sandcastle,\" said {child}.", d: "{child} kneels and digs in the sand with a spade, a red bucket beside them." },
    { t: "{child} filled the bucket and tipped it up. One, two, three, a big sandcastle!", d: "{child} lifts the bucket off a perfect sandcastle; two more stand next to it." },
    { t: "{adult} said, \"Let us look for shells.\" They went along the sand to the rocks.", d: "{child} and {adult} walk along the shoreline towards some rocks, looking down for shells." },
    { t: "{child} got a pink shell and a long thin shell. Then {child} got a shell with a hole in it.", d: "{child} holds out three shells in a cupped hand: a pink one, a long thin one and one with a hole." },
    { t: "In a rock pool, {child} spotted a crab. It was a little red crab with big claws.", d: "Looking into a clear rock pool: a small red crab with raised claws, seaweed around it; {child} points." },
    { t: "{pet} put a nose in the pool. Snip! The crab nipped {pet} on the nose!", d: "The crab pinches {pet}'s nose; {pet} jumps back with a startled face." },
    { t: "{pet} ran off and jumped into the sea. Splash! {child} and {adult} had to grin.", d: "{pet} splashes into the shallow waves; {child} and {adult} laugh on the sand." },
    { t: "When they got back, the sea had come up. The sandcastles were gone!", d: "The tide has washed over the place where the sandcastles were; only a flat bump and the red bucket remain; {child} looks surprised." },
    { t: "\"It did not want the sandcastles,\" said {adult}. \"It just wanted to splash them!\" They all went home with the shells.", d: "Evening at the beach; {child}, {adult} and {pet} walk home, {child} holding the shells, a pink sunset over the sea." }
  ]},
  { id: "s4-bus", stage: 4, title: "The bus trip", blurb: "A ride on the top of the bus, all the way to the end of the line.", cast: ["child", "adult"], pages: [
    { t: "{child} and {adult} went to the bus stop. \"Can we sit on the top?\" said {child}.", d: "A bus stop on a town street; {child} and {adult} wait as a red double-decker bus comes round the corner." },
    { t: "The bus stopped and {adult} held out the tickets. Then they ran up the steps to the top.", d: "{adult} shows tickets to a smiling bus driver; {child} is already heading for the stairs." },
    { t: "They sat at the front. {child} felt like the driver of the bus!", d: "{child} sits at the big front window on the top deck of the bus, hands out like steering a wheel; {adult} beside them." },
    { t: "The bus went past the shops and the park. {child} spotted a dog in a red coat.", d: "View from the top deck: shops, a park and a small dog in a red coat walking on the pavement." },
    { t: "Then the bus went up a hill. It went slow, slow, slow. It was a steep hill!", d: "The bus climbs a steep hill; inside, {child} leans forward as if to help it." },
    { t: "At the top of the hill, {child} could see the whole town. \"There is our flat!\" said {child}.", d: "From the top deck: a wide view of a little town; {child} points at a block of flats in the distance." },
    { t: "The bus stopped at the end of the line. It was a big park with a pond.", d: "The bus at its last stop beside a large park with a pond and ducks; {child} and {adult} step off." },
    { t: "{child} and {adult} had a picnic on the grass. They had rolls, crisps and a drink.", d: "{child} and {adult} sit on a picnic blanket on the grass with sandwiches, crisps and drinks, ducks nearby." },
    { t: "Then it was time to get the bus back. {child} ran to get the front seat.", d: "{child} runs up the stairs of the bus to grab the front seat on the top deck again." },
    { t: "On the trip back, {child} fell asleep. \"What a long trip,\" said {adult} with a grin.", d: "Late afternoon light on the top deck; {child} asleep against {adult}'s arm; {adult} smiles." }
  ]},
  { id: "s4-tarts", stage: 4, title: "The jam tarts", blurb: "Twelve jam tarts on the table. But one has gone missing!", cast: ["child", "adult", "pet"], pages: [
    { t: "{child} and {adult} got the flour, the butter and the jam. \"Let us make jam tarts,\" said {adult}.", d: "A kitchen counter with flour, butter, a jar of strawberry jam and a mixing bowl; {child} and {adult} tie on aprons." },
    { w: { child: "a yellow T-shirt and jeans with a red striped apron, a little flour on the nose" }, t: "{child} mixed and mixed. Then {child} rolled it flat with a rolling pin.", d: "{child} rolls out pastry with a rolling pin, flour everywhere; {pet} watches from the floor." },
    { w: { child: "a yellow T-shirt and jeans with a red striped apron, a little flour on the nose" }, t: "{adult} cut out the circles. {child} put a blob of jam in each one.", d: "{child} spoons jam into pastry cases in a tart tin; {adult} cuts circles with a cutter." },
    { w: { child: "a yellow T-shirt and jeans with a red striped apron, a little flour on the nose" }, t: "The tarts went in the oven. After a little wait, the kitchen smelt so good!", d: "{child} peers through the oven door at the tarts baking; a warm glow from the oven." },
    { w: { child: "a yellow T-shirt and jeans with a red striped apron, a little flour on the nose" }, t: "{adult} put twelve hot jam tarts on the table. \"Let them cool,\" said {adult}.", d: "Twelve golden jam tarts cool on a rack on the kitchen table." },
    { w: { child: "a yellow T-shirt and jeans with a red striped apron, a little flour on the nose" }, t: "{child} and {adult} went to wash up. When they got back, {child} counted the tarts.", d: "{child} points at the tarts one by one, counting; {adult} dries a bowl." },
    { w: { child: "a yellow T-shirt and jeans with a red striped apron, a little flour on the nose" }, t: "\"One, two, three... eleven! One tart has gone!\" said {child}. \"Who has it?\"", d: "{child} looks shocked at the cooling rack: there is an empty gap where one tart was." },
    { w: { child: "a yellow T-shirt and jeans with a red striped apron, a little flour on the nose" }, t: "{adult} did not have it. {child} did not have it. Then they looked at {pet}.", d: "{child} and {adult} turn slowly to look at {pet}, who sits very still, trying to look innocent." },
    { w: { child: "a yellow T-shirt and jeans with a red striped apron, a little flour on the nose" }, t: "{pet} had red jam on the chin! \"You had the tart!\" said {child}.", d: "Close-up of {pet} with a blob of red jam on the chin and a guilty look." },
    { t: "{adult} said, \"Never mind. There are eleven left!\" And they had a jam tart each.", d: "{child} and {adult} sit at the table eating jam tarts and laughing; {pet} licks its lips under the table." }
  ]},
  { id: "s4-frog", stage: 4, title: "Frog in the pond", blurb: "A little green frog sits on a lily pad. Can it jump to the bank?", cast: ["child", "adult", "pet"], pages: [
    { t: "{child} and {adult} went to the pond in the park. {pet} ran on in front.", d: "A green park with a reedy pond; {pet} runs ahead of {child} and {adult} along the path." },
    { t: "In the pond, {child} spotted a little green frog. It sat on a big flat lily pad.", d: "A small green frog sits on a large lily pad in the pond; {child} crouches on the bank, pointing." },
    { t: "\"Look at the frog!\" said {child}. \"It has big eyes and long legs.\"", d: "Close-up of the frog: big golden eyes, long folded legs, shiny green skin." },
    { t: "The frog went, \"Croak!\" Then it jumped to the next lily pad. Plop!", d: "The frog leaps from one lily pad to another with a little splash." },
    { t: "{pet} wanted to get the frog. {pet} went splash into the pond!", d: "{pet} jumps into the edge of the pond after the frog, sending up a big splash." },
    { t: "The frog was quick. It jumped onto a log and hid in the reeds.", d: "The frog hops onto a mossy log and slips into tall reeds; {pet} stands in the shallow water, confused." },
    { t: "{adult} got {pet} back on the bank. \"You are so wet!\" said {adult}.", d: "{adult} lifts dripping {pet} out onto the grass; {child} laughs." },
    { t: "{pet} shook and shook. Then {child} and {adult} got wet too!", d: "{pet} shakes off water in a spray of droplets; {child} and {adult} shield their faces." },
    { t: "{child} sat still on the bank and did not speak. Then the frog hopped out of the reeds.", d: "{child} sits very still on the bank; the frog peeks out of the reeds and hops onto a stone near them." },
    { t: "\"Hello, frog,\" said {child} softly. The frog went, \"Croak!\" It was a frog hello!", d: "The frog sits on a stone near {child}, both looking at each other; {pet} lies drying in the sun." }
  ]},
  { id: "s4-storm", stage: 4, title: "The storm", blurb: "The wind howls and the lights go out. Time for a torch and a story.", cast: ["child", "adult", "pet"], pages: [
    { t: "It was a dark and windy night. The wind went whoosh, whoosh down the chimney.", d: "Outside a cosy house at night, trees bending in a strong wind, dark clouds rushing past the moon." },
    { t: "Rain hit the windows. Drip, drip, drip! {pet} hid under the bed.", d: "Rain lashes a bedroom window; {pet} peeks out from under the bed." },
    { t: "Then there was a big flash of lightning. Crash! Bang! It was thunder.", d: "A bright flash of lightning lights up the room; {child} jumps in surprise." },
    { t: "And then the lights went out! It was pitch black. \"{adult}!\" said {child}.", d: "The room goes dark; only {child}'s wide eyes and a faint window light are seen." },
    { t: "{adult} came in with a torch. \"Do not be frightened,\" said {adult}. \"It is just a storm.\"", d: "{adult} comes in with a torch, its beam lighting a friendly path across the room to {child}." },
    { t: "{adult} lit some candles. The room was soft and yellow and not so scary.", d: "Candles in jars glow on a shelf; the room is warm and golden." },
    { t: "{child} got a big blanket. They made a den on the bed. {pet} crept in too.", d: "{child} and {adult} under a blanket den on the bed, lit by the torch; {pet} crawls in to join them." },
    { t: "{adult} told a story by torchlight. It was a story of a brave little boat in a storm.", d: "{adult} holds the torch under their chin to tell a story; {child} listens, hugging {pet}." },
    { t: "Soon the thunder went quiet. The rain went drip, drip, then stopped.", d: "The window shows the storm passing, the moon peeking out from the clouds." },
    { t: "Then the lights came back on! But {child} and {pet} were fast asleep in the den.", d: "The bedroom light is on again; {child} and {pet} are asleep in the blanket den; {adult} smiles and switches the light off." }
  ]},
  { id: "s4-den", stage: 4, title: "The den in the wood", blurb: "Sticks, ferns and a blanket make the best den in the wood.", cast: ["child", "adult", "pet"], pages: [
    { t: "{child}, {adult} and {pet} went for a walk in the wood. The trees were tall and green.", d: "A sunny woodland path with tall trees and ferns; {child}, {adult} and {pet} walking along." },
    { t: "\"Let us make a den,\" said {child}. \"We can use sticks and ferns.\"", d: "{child} points at a big fallen tree with lots of sticks around it; {adult} nods." },
    { t: "{child} and {adult} got long sticks. They rested them on a big log.", d: "{child} and {adult} lean long sticks against a fallen log to make a den frame." },
    { t: "{pet} wanted to help. {pet} got a stick too, but it was a very little one!", d: "{pet} proudly carries a tiny twig in its mouth." },
    { t: "Then they put ferns on the sticks. The den was green and snug.", d: "{child} drapes big green ferns over the sticks; the den looks like a little green tent." },
    { t: "{child} crept in. It was dark in the den. It smelt of soil and moss.", d: "{child} peeks out from inside the snug fern den, smiling." },
    { t: "{adult} had a flask of hot chocolate and some biscuits. They had a snack in the den.", d: "{adult} and {child} squeeze inside the den with a flask and a tin of biscuits; {pet} sniffs the biscuits." },
    { t: "Then {child} spotted a robin on a branch. It had a red chest and a little black eye.", d: "A robin on a branch near the den entrance; {child} points at it from inside." },
    { t: "The robin hopped down and pecked at a crumb. {child} kept still and did not speak.", d: "The robin pecks at a biscuit crumb on the ground just outside the den; {child} holds very still." },
    { t: "\"We will come back to the den next week,\" said {child}. \"And the robin can come too!\"", d: "{child}, {adult} and {pet} walk away along the path, looking back at the fern den; the robin sits on top of it." }
  ]},
  { id: "s4-vet", stage: 4, title: "A trip to the vet", blurb: "{pet} has a sore paw. Will the vet help?", cast: ["child", "adult", "pet"], pages: [
    { t: "{pet} was not well. {pet} did not want to run or jump. {pet} held up a sore paw.", d: "{pet} lies on a cushion looking sorry for itself, holding up one paw; {child} strokes {pet}." },
    { t: "\"We must go to the vet,\" said {adult}. {child} put {pet} in the car.", d: "{child} gently lifts {pet} into a pet carrier in the back of a car; {adult} holds the car door." },
    { t: "At the vet, there was a big dog. There was a cat in a box. There was a rabbit with long ears.", d: "A vet's waiting room with a big dog, a cat in a carrier and a rabbit with long ears; {child} sits with {pet}." },
    { t: "Then the vet said, \"{pet}, come in!\" The vet had a kind grin and a green top.", d: "A friendly vet in green scrubs calls from a doorway; {child} and {adult} stand up with {pet}." },
    { t: "The vet felt {pet}'s paw. \"It is a thorn,\" said the vet. \"It is stuck in the pad.\"", d: "The vet gently holds {pet}'s paw on the examination table, looking at a tiny thorn; {child} watches." },
    { t: "{child} held {pet} and said, \"It will be fine. Be brave!\" The vet got the thorn out.", d: "{child} hugs {pet}'s head while the vet pulls out the thorn with tweezers." },
    { t: "\"Well done,\" said the vet, and {pet} got a treat. {pet} was so glad!", d: "The vet gives {pet} a treat; {pet} wags happily; {child} beams." },
    { t: "{pet} got a little bandage on the paw. It was a bright red one.", d: "{pet} sits on the table proudly showing a little red bandage on one paw." },
    { t: "Back at home, {pet} had a rest in a basket. {child} sat next to {pet} all the time.", d: "At home, {pet} rests in a cosy basket; {child} sits beside it reading a book." },
    { t: "The next morning, {pet} ran into the garden. {pet} jumped up and down. {pet} was well again!", d: "Morning in the garden; {pet} leaps happily on the grass, bandage gone; {child} and {adult} cheer at the back door." }
  ]},
  { id: "s4-swim", stage: 4, title: "In the swimming pool", blurb: "Armbands on, a big splash, and the first swim with no help.", cast: ["child", "adult"], pages: [
    { w: { child: "a bright blue swimming costume with a little yellow star and orange armbands" }, t: "{child} and {adult} went to the swimming pool. {child} had a bag with a towel and armbands.", d: "Outside a leisure centre; {child} carries a swim bag, {adult} holds the door." },
    { w: { child: "a bright blue swimming costume with a little yellow star and orange armbands" }, t: "The pool was big and blue. It had a slide and a fountain that went splash.", d: "A bright indoor swimming pool with a curly slide and a little fountain; {child} stares in delight." },
    { w: { child: "a bright blue swimming costume with a little yellow star and orange armbands" }, t: "{child} put the armbands on and got into the shallow end. The water was cool.", d: "{child} in orange armbands steps down the pool steps into shallow water." },
    { w: { child: "a bright blue swimming costume with a little yellow star and orange armbands" }, t: "{adult} held {child}'s hands. \"Kick, kick, kick!\" said {adult}. Splash, splash!", d: "{adult} in the water holds {child}'s hands as {child} kicks, splashing water everywhere." },
    { w: { child: "a bright blue swimming costume with a little yellow star and orange armbands" }, t: "Then {child} went down the slide. Whoosh! Splash! {child} came up with a big grin.", d: "{child} zooms off the end of the slide into the water with a splash." },
    { w: { child: "a bright blue swimming costume with a little yellow star and orange armbands" }, t: "\"Can I swim with no armbands?\" said {child}. \"Let us try,\" said {adult}.", d: "{child} takes off one armband, looking determined; {adult} stands ready a little way off." },
    { w: { child: "a bright blue swimming costume with a little yellow star and orange armbands" }, t: "{adult} stood a little way off. {child} kicked and swam and kicked and swam.", d: "{child} swims a few strokes towards {adult}, chin up, kicking hard." },
    { w: { child: "a bright blue swimming costume with a little yellow star and orange armbands" }, t: "{child} got to {adult}! \"I did it!\" said {child}. \"I swam all on my own!\"", d: "{child} reaches {adult}'s arms; both are cheering." },
    { w: { child: "a bright blue swimming costume with a little yellow star and orange armbands" }, t: "A lifeguard gave {child} a thumbs up. \"Well done!\" she said.", d: "A smiling lifeguard on a tall chair gives a thumbs up." },
    { t: "Then they had chips in the café. {child} felt so proud and so hungry!", d: "In the leisure centre café, {child} with damp hair eats chips next to {adult}, holding up a swimming certificate." }
  ]}
];

if (typeof module !== "undefined" && module.exports) module.exports = FLR.readers;
