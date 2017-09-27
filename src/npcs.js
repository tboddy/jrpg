const npcs = {

	coith: {
		name: 'Commander Coith',
		dialog: {
			data: {
				copy: 'I poop my pants so damn well. I poop them well, so that theymay swell.',
				choices: {
					prompt: 'Will you dump my load?',
					options: [
						{
							label: 'yes',
							result: 0
						},
						{
							label: 'no',
							result: 1
						}
					]
				}
			},
			children: [
				{
					data: {
						copy: 'Great. Take this for being so agreeable.'
					}
				}
			]
		}
	}

};