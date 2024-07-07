//
//  ViewController.swift
//  AutoPIREP
//
//  Created by Hans Gaensbauer on 7/7/24.
//

import UIKit
import CoreMotion

class ViewController: UIViewController {
    @IBOutlet weak var acceleration_x: UILabel!
    @IBOutlet weak var acceleration_y: UILabel!
    @IBOutlet weak var acceleration_z: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        MyAccelerometer()
    }
    
    var motion = CMMotionManager()
    func MyAccelerometer(){
        motion.accelerometerUpdateInterval = 0.5
        motion.startAccelerometerUpdates(to: OperationQueue.current!){ (data, error) in
            if let trueData = data{
                print(trueData)
            }
        }
    }


}

