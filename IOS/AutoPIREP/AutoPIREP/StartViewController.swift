//
//  ViewController.swift
//  AutoPIREP
//
//  Created by Hans Gaensbauer on 7/7/24.
//

import UIKit
import CoreMotion
import CoreLocation
import CommonCrypto //Used for hashing uuid

class StartViewController: UIViewController, CLLocationManagerDelegate{
    let locationManager = CLLocationManager()
    let maxpireps = 25
    
    @IBOutlet weak var start_stop_button: UIButton!
    @IBOutlet weak var aircraft_button: UIButton!
    @IBOutlet weak var aircraftlabel: UILabel!
    
    struct PIREP: Codable {
        var report_id: UInt64 = 0
        var aircraft = ""
        var severity = 0
        var timestamp = 0
        var geohash = ""
        var altitude = 0
    }
    
    struct PIREP_SET: Codable {
        var items: [PIREP] = [PIREP]()
    }
    
    var pireps = PIREP_SET()
    var pireps_queue = PIREP_SET()
    
    //Thresholds
    let THRESHOLD_LIGHT = 0.5
    let THRESHOLD_MODERATE = 1.0
    let THRESHOLD_SEVERE = 2.0
    
    let MIN_PIREP_INTERVAL = 5*1000 //5 seconds
    
    var inflight: Bool = false
    
    let aircraft_dict: [String: String] = [
        "":"None",
        "Cessna 172": "C172",
        "Piper PA-28": "P28",
        "Cessna 150": "C150",
        "Cessna 152": "C152",
        "Cessna 182": "C182",
        "Piper J-3 Cub": "J3",
        "Beechcraft Bonanza": "BE36",
        "Mooney M20": "M20P",
        "Piper Pacer": "PA20",
        "Cirrus SR22": "SR22",
        "Diamond DA40 NG": "DA40"]
    
    var aircraft = "Select"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyKilometer
        
//        locationManager.requestWhenInUseAuthorization()
        locationManager.requestAlwaysAuthorization()
        
        let actionClosure = { (action: UIAction) in
            self.aircraft = action.title
        }
        
        var menuChildren: [UIMenuElement] = []
        for airplane in aircraft_dict.keys.sorted() {
            menuChildren.append(UIAction(title: airplane, handler: actionClosure))
        }
        
        aircraft_button.menu = UIMenu(options: .displayInline, children: menuChildren)
        
        aircraft_button.showsMenuAsPrimaryAction = true
        aircraft_button.changesSelectionAsPrimaryAction = true
    }
    
    var motion = CMMotionManager()
    func StartAccelerometer(){
        motion.accelerometerUpdateInterval = 0.1
        motion.startDeviceMotionUpdates(to: OperationQueue.current!){ (data, error) in
            if let acceleration = data?.userAcceleration{
                let totalAcceleration = sqrt(pow(acceleration.x, 2) +
                                             pow(acceleration.y, 2) +
                                             pow(acceleration.z, 2))
                
                if (totalAcceleration > self.THRESHOLD_SEVERE) {
                    self.updatePIREP(severity: 5)
                } else if (totalAcceleration > self.THRESHOLD_MODERATE) {
                    self.updatePIREP(severity: 3)
                } else if (totalAcceleration > self.THRESHOLD_LIGHT) {
                    self.updatePIREP(severity: 1)
                }
                
                if let lasttimestamp = self.pireps_queue.items.last?.timestamp{
                    if(Int(Date().timeIntervalSince1970 * 1000) - lasttimestamp > self.MIN_PIREP_INTERVAL){
                        self.view.backgroundColor = UIColor.black
                    }
                }
                
            }
        }
    }
    
    // CLLocationManagerDelegate method
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if let location = locations.last {
            if(self.pireps_queue.items.count > 0) {
                self.pireps_queue.items[self.pireps_queue.items.count - 1].geohash = location.coordinate.geohash(length:5)
                self.pireps_queue.items[self.pireps_queue.items.count - 1].altitude = Int(location.altitude*3.28084) //convert to ft
                if(self.pireps_queue.items[self.pireps_queue.items.count - 1].geohash != ""){
                    //This is now a valid PIREP, append it to the real PIREPs list if it's not there already
                    if(self.pireps_queue.items.count != self.pireps.items.count){
                        self.pireps.items.append(self.pireps_queue.items[self.pireps_queue.items.count - 1])
                        print("Added Location")
                    }

                }
            }
        }
    }

    // Handle authorization status changes
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        switch status {
        case .notDetermined:
            print("Location permission not determined")
        case .restricted, .denied:
            print("Location permission denied")
        case .authorizedWhenInUse, .authorizedAlways:
            print("Location permission granted")
        @unknown default:
            print("Unknown location permission status")
        }
    }

    // Handle location manager errors
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Failed to get location: \(error.localizedDescription)")
    }
    
    @IBAction func flightButtonPressed(_ sender: Any) {
        inflight.toggle()
        
        // Update button color
        updateButtonAppearance()
        
        if inflight {
            print(self.pireps_queue.items.count)
            self.view.backgroundColor = UIColor.black
            StartAccelerometer()
            locationManager.startUpdatingLocation()
            aircraftlabel.text = self.aircraft
            aircraftlabel.textColor = UIColor.white
            aircraft_button.isHidden = true
        } else {
            motion.stopDeviceMotionUpdates()
            self.view.backgroundColor = UIColor.white
            aircraftlabel.text = "Select Aircraft"
            aircraftlabel.textColor = UIColor.black
            aircraft_button.isHidden = false
            self.sendPIREPs()
            self.pireps_queue.items.removeAll()
            self.pireps.items.removeAll()
            print("Clearing PIREPS!")
            print(self.pireps_queue.items.count)
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
    
    
    func updatePIREP(severity: Int) {
        let currenttime = Int(Date().timeIntervalSince1970 * 1000)
        var myaircraft = ""
        if let dac = aircraft_dict[self.aircraft]{
            myaircraft = dac
        }
        if(self.pireps_queue.items.count > 0) {
            if(currenttime - self.pireps_queue.items[self.pireps_queue.items.count - 1].timestamp > self.MIN_PIREP_INTERVAL){
                print("Creating new PIREP")
                if(self.pireps_queue.items.count >= self.maxpireps){
                    print("Too many PIREPS, deleting the least severe")
                    var minseverity = 5
                    var minseverity_idx = 0
                    for i in 0...self.maxpireps-1 {
                        if(self.pireps_queue.items[i].severity < minseverity){
                            minseverity = self.pireps_queue.items[i].severity
                            minseverity_idx = i
                        }
                    }
                    self.pireps_queue.items.remove(at: minseverity_idx)
                }
                self.pireps_queue.items.append(PIREP(
                    report_id: UInt64(currenttime * 100) + UInt64(getHashedUUID()),
                    aircraft: myaircraft,
                    severity: severity,
                    timestamp: currenttime,
                    geohash: "",
                    altitude: 0
                ))
            } else if(severity > self.pireps_queue.items[self.pireps_queue.items.count - 1].severity){
                print("Upgrading PIREP")
                self.pireps_queue.items[self.pireps_queue.items.count - 1].severity = severity
            }
        } else {
            print("Creating new PIREP")
            self.pireps_queue.items.append(PIREP(
                report_id: UInt64(currenttime * 100) + UInt64(getHashedUUID()),
                aircraft: myaircraft,
                severity: severity,
                timestamp: currenttime,
                geohash: "",
                altitude: 0
            ))
        }
        
        locationManager.requestLocation()
        
        switch (self.pireps_queue.items[self.pireps_queue.items.count - 1].severity){
        case 1: self.view.backgroundColor = UIColor(red: 0.0, green: 0.2, blue: 0.0, alpha: 1.0)
        case 3: self.view.backgroundColor = UIColor(red: 0.15, green: 0.15, blue: 0.0, alpha: 1.0)
        case 5: self.view.backgroundColor = UIColor(red: 0.2, green: 0.0, blue: 0.0, alpha: 1.0)
        default: self.view.backgroundColor = UIColor.black
        }
    }

    func getHashedUUID() -> Int {
        if let uuidString = UIDevice.current.identifierForVendor?.uuidString {
            let data = Data(uuidString.utf8)
            var hash = Data(count: Int(CC_SHA256_DIGEST_LENGTH))
            _ = hash.withUnsafeMutableBytes { hashBytes in
                data.withUnsafeBytes { dataBytes in
                    CC_SHA256(dataBytes.baseAddress, CC_LONG(data.count), hashBytes.bindMemory(to: UInt8.self).baseAddress)
                }
            }
            var hashValue: Int = 0
            hash.withUnsafeBytes {
                hashValue = $0.load(as: Int.self)
            }
            return abs(hashValue) % 100
        } else {
            print("Failed to get UUID")
            return -1
        }
    }
    
    func sendPIREPs() {
        if(self.pireps.items.count > 0){
            // Define the URL
            guard let url = URL(string: "https://zohmomjv73.execute-api.us-east-1.amazonaws.com/prod/report") else { return }
            
            // Create the URLRequest object
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")

            // Create the JSON data to send in the request body
            let jsonEncoder = JSONEncoder()
            jsonEncoder.outputFormatting = .prettyPrinted

            do {
                let encodePIREP = try jsonEncoder.encode(self.pireps)
                let endcodeStringPIREPS = String(data: encodePIREP, encoding: .utf8)!
                print(endcodeStringPIREPS)
                // Assign the JSON data to the request body
                request.httpBody = encodePIREP
                
                // Create a URLSession data task
                let task = URLSession.shared.dataTask(with: request) { data, response, error in
                    // Handle errors
                    if let error = error {
                        print("Error: \(error.localizedDescription)")
                        return
                    }

                    // Handle the response
                    if let data = data, let response = response as? HTTPURLResponse {
                        print("Response Code: \(response.statusCode)")

                        // Parse the response data if needed
                        if let responseData = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                            print("Response Data: \(responseData)")
                        }
                    }
                }

                // Start the data task
                task.resume()
            } catch {
                print(error.localizedDescription)
            }
        }
    }
}
