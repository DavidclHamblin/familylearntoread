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
  ]}
];

if (typeof module !== "undefined" && module.exports) module.exports = FLR.readers;
