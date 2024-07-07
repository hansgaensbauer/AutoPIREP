//
//  ViewController.swift
//  AutoPIREP
//
//  Created by Hans Gaensbauer on 7/7/24.
//

import UIKit
import CoreMotion

class StartViewController: UIViewController {
    @IBOutlet weak var start_stop_button: UIButton!
    @IBOutlet weak var aircraft_button: UIButton!
    @IBOutlet weak var aircraftlabel: UILabel!
    
    var inflight: Bool = false
    
    let aircraft_list = ["Select", "Boeing 737", "Cessna 172", "Boeing B-52", "Lockheed C-130J", "Zeppelin"]
    
    var aircraft = "UNSET"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let actionClosure = { (action: UIAction) in
            self.aircraft = action.title
        }
        
        var menuChildren: [UIMenuElement] = []
        for airplane in aircraft_list {
            menuChildren.append(UIAction(title: airplane, handler: actionClosure))
        }
        
        aircraft_button.menu = UIMenu(options: .displayInline, children: menuChildren)
        
        aircraft_button.showsMenuAsPrimaryAction = true
        aircraft_button.changesSelectionAsPrimaryAction = true
    }
    
    var motion = CMMotionManager()
    func StartAccelerometer(){
        motion.accelerometerUpdateInterval = 0.5
        motion.startAccelerometerUpdates(to: OperationQueue.current!){ (data, error) in
            if let trueData = data{
                print(trueData)
            }
        }
    }
    
    @IBAction func flightButtonPressed(_ sender: Any) {
        inflight.toggle()
        
        // Update button color
        updateButtonAppearance()
        
        if inflight {
            self.view.backgroundColor = UIColor.black
            StartAccelerometer()
            aircraftlabel.text = self.aircraft
            aircraftlabel.textColor = UIColor.white
            aircraft_button.isHidden = true
        } else {
            motion.stopAccelerometerUpdates()
            self.view.backgroundColor = UIColor.white
            aircraftlabel.text = "Select Aircraft"
            aircraftlabel.textColor = UIColor.black
            aircraft_button.isHidden = false
        }
    }
    
    // Function to update button appearance based on state
    func updateButtonAppearance() {
        var config = UIButton.Configuration.filled()
        if inflight {
            config.baseBackgroundColor = UIColor.systemRed
            config.title = "End Flight"
        } else {
            config.baseBackgroundColor = UIColor.systemGreen
            config.title = "Start Flight"
        }
        start_stop_button.configuration = config
    }
}
