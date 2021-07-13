import './App.css';
import React,{Component} from 'react';
import {FirestoreService} from "./Components/firebaseApi";
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component {
  state = {
    hidden: false,
    firstHidden: true
  };

  weightedChoice=(weights) => {
    const weightSum = weights.reduce((sum, w) => sum + w)
    let choice = Math.floor(Math.random() * weightSum) + 1
    let idx = weights.length - 1

    while ((choice -= weights[idx]) > 0) {
      idx -= 1
    }
    return idx
  }


  async UNSAFE_componentWillMount() {
    const response = await fetch('https://geolocation-db.com/json/');
    const data = await response.json();
    if (typeof data.IPv4 !== 'undefined'){
      console.log(data.IPv4);
      this.setState({ ip: data.IPv4 });
    }else{
      console.log("IP indefinido");
      this.setState({ ip: String(Date.now()) });
    }

  }
  
  componentDidMount(){

    FirestoreService.getAll("video-comments-count").get().then((querySnapshot) => {
      const listStores = [];

      querySnapshot.forEach((doc) => {
        listStores.push(doc.data());
      });

      let comments_count_list = listStores[0]['video-comments-count'].split("|");
      let id_comment = [];
      let count_reviews = [];

      comments_count_list.forEach(function(comment){
        id_comment.push(comment.split(",")[0]);
        count_reviews.push(parseFloat(comment.split(",")[1]));
      });
      
      let weightedChoiceIdx = this.weightedChoice(count_reviews);

      FirestoreService.getDoc('youtube-comments',id_comment[weightedChoiceIdx]).get().then((doc) =>{
        this.setState({
          nextCommentId: id_comment[weightedChoiceIdx],
          comment: doc.data()['comment'],
          arrId: id_comment,
          arrReviews: count_reviews,
          full_comment: listStores[0]['video-comments-count'],
          choiceIdx: weightedChoiceIdx,
          firstHidden: false
        });
      });

    });

    

  }

  
  

  changeVideoCommentId=(e,review)=> {

    this.setState({
      hidden: true
    });
    
    let choiceIdx = this.state.choiceIdx;
    let review_count = this.state.arrId[choiceIdx]+","+this.state.arrReviews[choiceIdx]
    let review_count_before = this.state.arrId[choiceIdx]+","+(this.state.arrReviews[choiceIdx]-1)
    let fullComment = this.state.full_comment;
    let changeArrReviews = this.state.arrReviews;
    //let currentIp = this.state.ip;


    fullComment = fullComment.replace(review_count,review_count_before);
    changeArrReviews[choiceIdx] = changeArrReviews[choiceIdx] - 1;

    FirestoreService.update('video-comments-count','count',{"video-comments-count": fullComment});
    FirestoreService.db.collection("video-comments-reviews").doc(String(this.state.arrId[choiceIdx])).collection(String(this.state.ip)).doc('reviews').set({"reviews-count":  changeArrReviews[choiceIdx], "type": review});

    choiceIdx = this.weightedChoice(changeArrReviews);

    let nextCommentId = String(this.state.arrId[choiceIdx]);
    FirestoreService.getDoc('youtube-comments',this.state.arrId[choiceIdx]).get().then((doc) =>{

      this.setState({
        nextCommentId: nextCommentId,
        comment: doc.data()['comment'],
        arrReviews: changeArrReviews,
        full_comment: fullComment,
        choiceIdx: choiceIdx,
        hidden: false
      });
    });
  }
  
  
  render(){

    //console.log(this.state);
    return (
          <Container className={this.state.firstHidden?"lds-facebook":"default"}>
            <div></div><div></div><div></div>
            <div className={this.state.firstHidden?"center box":"center"}>
              <Row >
                <Col>
                  <Card
                    bg={'Info'.toLowerCase()}
                    key={0}
                    text={'Info'.toLowerCase() === 'light' ? 'dark' : 'white'}
                    style={{ width: '50rem', height: '30rem' }}
                    className="text-center"
                    border="dark"
                  >
                  <Card.Header>Essa é uma frase positiva, negativa ou neutra?</Card.Header>
                    <Card.Body>
                      <Card.Text class="comment">
                      <div>
                        {this.state.comment}
                      </div>
                      
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                      <div className={this.state.hidden?"lds-ellipsis":"default"}>
                        <div></div><div></div><div></div><div></div>
                        <Row className="button">
                          <Col >
                            <Button size="lg" variant="danger" onClick={e => this.changeVideoCommentId(e,-1)} >NEGATIVO</Button>
                          </Col>
                          <Col>
                            <Button size="lg" variant="warning" onClick={e => this.changeVideoCommentId(e,0)}>NEUTRO</Button>
                          </Col>
                          <Col>
                            <Button size="lg" variant="success" onClick={e => this.changeVideoCommentId(e,1)}>POSITIVO</Button>
                          </Col>
                        </Row>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              </Row>
            </div>
          </Container>
    );

  }
}

export default App;
