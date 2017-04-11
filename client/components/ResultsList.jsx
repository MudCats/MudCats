// Component generatees each search result entry
class ResultsList extends React.Component {
	constructor(props){
		super(props);
	}

	render () {
		console.log('Album data structure', this.props.albums);

		return (
			<div>
				{this.props.albums.map((album) => {
					return (
						<Result addNewEntry={this.props.addNewEntry}
							      setSelected={this.props.setSelected}
										key={album.collectionId}
										album={album}/>
						)}
					)
				}
			</div>
		);
	}

}

window.ResultsList = ResultsList;
