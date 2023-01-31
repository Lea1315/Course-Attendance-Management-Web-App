let div = document.getElementById("divSadrzaj");
let prisustvo = TabelaPrisustvo(div, {
	"studenti": [{
			"ime": "Lea Jesenković",
			"index": 18680
		},
		{
			"ime": "Azra Krehić",
			"index": 18756
		},
		{
			"ime": "Amina Hamzić",
			"index": 18765
		}
	],
	"prisustva": [{
			"sedmica": 1,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 18680
		},
		{
			"sedmica": 2,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 18680
		},
		{
			"sedmica": 3,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 18680
		},
		{
			"sedmica": 4,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 18680
		},
		{
			"sedmica": 5,
			"predavanja": 3,
			"vjezbe": 1,
			"index": 18680
		},
		{
			"sedmica": 1,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 18756
		},
		{
			"sedmica": 2,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 18756
		},
		{
			"sedmica": 3,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 18756
		},
		{
			"sedmica": 4,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 18756
		},
		{
			"sedmica": 5,
			"predavanja": 2,
			"vjezbe": 1,
			"index": 18756
		},
		{
			"sedmica": 1,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 18765
		},
		{
			"sedmica": 2,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 18765
		},
		{
			"sedmica": 3,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 18765
		},
		{
			"sedmica": 4,
			"predavanja": 3,
			"vjezbe": 2,
			"index": 18765
		},
		{
			"sedmica": 5,
			"predavanja": 3,
			"vjezbe": 0,
			"index": 18765
		}
	],
	"predmet": "Razvoj programskih rješenja",
	"brojPredavanjaSedmicno": 3,
	"brojVjezbiSedmicno": 2
}
);
prisustvo.prethodnaSedmica();
prisustvo.sljedecaSedmica();




