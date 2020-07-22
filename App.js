import React, { Component } from 'react';
import { StyleSheet, View,Text, Image, Alert, Modal, TouchableHighlight, Button, CheckBox} from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.onCheckboxValueChange = this.onCheckboxValueChange.bind(this);
    this.state = {
      modalVisible: false,
      originalHeadTable: ['Horse No', 'Last 6 Runs', 'Color', 'Horse', 'Wt', 'Jockey', 'Draw', 'Trainer', 'Rfg'
      , 'Rfg+/-', 'Horse Wt Declaration', 'Priority', 'Gear'],
      updatedHeaderTable: ['Horse No', 'Last 6 Runs', 'Color', 'Horse', 'Wt', 'Jockey', 'Draw', 'Trainer', 'Rfg'
      , 'Rfg+/-', 'Horse Wt Declaration', 'Priority', 'Gear']
    }
  }


  initialiseHeaderStates() {
    const {originalHeadTable} = this.state;
    let checked = [];
    originalHeadTable.map((name, i) => (
      checked[name] = true
    ));
    this.setState({ checked: checked })
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  /*
  data as json
  headers as array
  */
  getUpdateData(data, headers) {
    const rowData = [];
    for (let i = 0; i < data.length; i++) {
      const dataRow = [];
      if(data[i].horseNo && headers.includes('Horse No'))
        dataRow[0] = data[i].horseNo
      if(data[i].last6Runs && headers.includes('Last 6 Runs'))
        dataRow[1] = data[i].last6Runs
      if(data[i].color && headers.includes('Color'))
        dataRow[2] = data[i].color
      if(data[i].horse && headers.includes('Horse'))
        dataRow[3] = data[i].horse
      if(data[i].wt && headers.includes('Wt'))
        dataRow[4] = data[i].wt
      if(data[i].jockey && headers.includes('Jockey'))
        dataRow[5] = data[i].jockey
      if(data[i].draw && headers.includes('Draw'))
        dataRow[6] = data[i].draw
      if(data[i].trainer && headers.includes('Trainer'))
        dataRow[7] = data[i].trainer
      if(data[i].rfg && headers.includes('Rfg'))
        dataRow[8] = data[i].rfg
      if(data[i].rfgPlusMinus && headers.includes('Rfg+/-'))
        dataRow[9] = data[i].rfgPlusMinus
      if(data[i].horseWtDec && headers.includes('Horse Wt Declaration'))
        dataRow[10] = data[i].horseWtDec
      if(data[i].priority && headers.includes('Priority'))
        dataRow[11] = data[i].priority
      if(data[i].gear && headers.includes('Gear'))
        dataRow[12] = data[i].gear

      rowData.push(dataRow);
    }
    return rowData;
  }

  componentDidMount(){
    this.initialiseHeaderStates();
  }

  updateColumnHeaders(){
    const {originalHeadTable, checked, updatedHeaderTable} = this.state;
    let newUpdatedHeaderTable = [];
    originalHeadTable.map((el, i) => {
        if(checked[el]){
          newUpdatedHeaderTable.push(originalHeadTable[i]);
        }
      }
    )
    this.setState({ updatedHeaderTable: newUpdatedHeaderTable });
  }

  onCheckboxValueChange(value, name)  {
    console.log(value, name)
    const {checked} = this.state;
    checked[name] = value;
    this.setState({ checked: checked })
  }

  render() {
    const { ...props } = this.props;
    const {originalHeadTable, modalVisible, checked, updatedHeaderTable} = this.state;
    const data = this.getUpdateData(SCORECARDS, updatedHeaderTable);
    console.log('render > updatedHeaderTable > ' + updatedHeaderTable);
    return (
      <View style={styles.container}>
        {
          checked ?
        (<Modal 
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Updated the table view");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hide/Show the Table Columns</Text>
              {
                originalHeadTable.map((colHead, i) => (
                  <>
                  <View key={i} style={styles.modalCheckbox}>
                  <Text style={styles.modalCheckboxText}>{colHead}</Text>
                  <CheckBox
                    value={checked[colHead]}
                    onValueChange={() => checked[colHead] ? this.onCheckboxValueChange(false, colHead) : this.onCheckboxValueChange(true, colHead)}
                  />
                  </View>

                  </>
                  ))
              }

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  this.updateColumnHeaders();
                  this.setModalVisible(false);
                }}
              >
                <Text style={styles.closeTextStyle}>Update & Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>) : null
      }

      <View style={styles.container}>
          <Button
          title="Hide/Show Columns"
          onPress={() => this.setModalVisible(!modalVisible)}
          />

        <View style={{borderWidth: 1, borderColor: '#bbbbbb'}}>
          {/*<Row data={HeadTable} style={styles.HeadStyle} textStyle={styles.TableText}/> */}
            <View style={[styles.row]}>
                {
                  updatedHeaderTable.map((colHead, i) => (
                        <Text key={i} style={[styles.HeadStyle, styles.borderCellLeft]} {...props}>
                          {colHead}
                        </Text>
                    ))
                }
            </View>
          {
            data.map((dataRow, index) => (
              <View
                key={index}
                style={[styles.row, styles.text, index%2 && {backgroundColor: '#ffffff'}]}>
                {
                  dataRow.map((colItem, i) => (
                    i == 2 ?
                    (
                      <View key={i}
                          style={styles.borderCellLeft}>
                          <Image
                          style={styles.tinyLogo}
                          source={images[colItem]}
                          />
                      </View>
                    )
                    :
                    (
                    <View
                      key={i}
                      style={i != dataRow.length ? styles.borderCellLeft : styles.borderCellRight }
                    >
                      <Text style={styles.text} {...props}>
                        {colItem}
                      </Text>
                    </View>
                  )
                  ))
                }
              </View>
            ))
          }
          {/*
          source={require(colItem)}
            /*
          <Rows data={state.DataTable} textStyle={styles.TableText}/>
          */}
        </View>
      </View>
      </View>
    )
  }
}



const SCORECARDS = [
  {horseNo: 'Sporting 1', last6Runs: '9/11/12/13/5', color: 'RED',
  horse: 'Football', wt: '1.33', jockey: 'Hell1', draw:'10', trainer: 'hull',
  rfg: '40', rfgPlusMinus: '-2', horseWtDec: ' ', priority: '+1', gear: 'B'},
  {horseNo: 'Sporting 2', last6Runs: '8/11/12/13/5', color: 'BLUE',
  horse: 'Football', wt: '1.33', jockey: 'Hell1', draw:'10', trainer: 'hull',
  rfg: '40', rfgPlusMinus: '-2', horseWtDec: ' ', priority: '+1', gear: 'B'},
  {horseNo: 'Sporting 3', last6Runs: '7/11/12/13/5', color: 'BLUE',
  horse: 'Football', wt: '1.33', jockey: 'Hell1', draw:'10', trainer: 'hull',
  rfg: '40', rfgPlusMinus: '-2', horseWtDec: ' ', priority: '+1', gear: 'B'},
  {horseNo: 'Sporting 4', last6Runs: '5/11/12/13/5', color: 'RED',
  horse: 'Football', wt: '1.33', jockey: 'Hell1', draw:'10', trainer: 'hull',
  rfg: '40', rfgPlusMinus: '-2', horseWtDec: ' ', priority: '+1', gear: 'B'},
  {horseNo: 'Sporting 5', last6Runs: '19/11/12/13/5', color: 'BLUE',
  horse: 'Football', wt: '1.33', jockey: 'Hell1', draw:'10', trainer: 'hull',
  rfg: '40', rfgPlusMinus: '-2', horseWtDec: ' ', priority: '+1', gear: 'B'},
];

const images = {
 'RED': "./assets/icon.png",
 'BLUE': "./assets/favicon.png"
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 35,
    backgroundColor: '#ffffff'
  },
  HeadStyle: {
    flex: 1,
    height: 50,
    textAlign: "center",
    /*alignContent: "center",*/
    backgroundColor: '#8cc3c3'
  },
  text: {
    alignContent: 'center',
  },
  row: {
    height: 40,
    backgroundColor: '#F7F8FA',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  tinyLogo: {
    width: 40,
    height: 40,
  },
  borderCellLeft: {
    flex: 1,
    borderLeftWidth:1,
    alignItems: "center",
  },
  borderCellRight: {
    flex: 1,
    borderRightWidth:1,
    alignItems: "center",

  },

  //modal view
  centeredView: {
    flex: 1,
    marginTop: 22
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },

  closeTextStyle: {
    paddingTop: 10,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },

  //modal checkbox
  modalCheckbox: {
    padding: 2,
    flexDirection:'row',
  },

  modalCheckboxText:{
    marginLeft: 4,
    fontWeight: "bold",
    color: "black",
  }
});
