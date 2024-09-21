;; A crowdfunding contract that allows users to create campaign, donate to them, and retrieve campaign information.

;; Errors
(define-constant  err-deadline-in-past (err u100))
(define-constant err-campaign-not-found (err u101))
(define-constant err-send-funds-failed (err u102))
(define-constant err-invalid-owner (err u205))
(define-constant err-invalid-title (err u200))
(define-constant err-invalid-description (err u201))
(define-constant err-invalid-target (err u202))
(define-constant err-invalid-deadline (err u203))
(define-constant err-invalid-image (err u204))


;; Data variable to track the total number of campaigns created, used for generating unique campaign IDs.
(define-data-var number-of-campaigns uint u0)

;; Campaign structure
;; Each campaign has an owner, title, description, target, deadline, amount collected, and lists of donators and donations
(define-map campaigns
    uint
    { owner: principal,
      title: (buff 200),
      description: (buff 500),
      target: uint,
      deadline: uint,
      amount-collected: uint,
      image: (buff 200) 
})

;; Define a mapping to store the donators and their respective donations for each campaign.
(define-map campaign-donators uint {donators: (list 100 principal), donations: (list 100 uint)})



;; Create a new campaign
(define-public (create-campaign 
  (owner principal) 
  (title (buff 200)) 
  (description (buff 500)) 
  (target uint) 
  (deadline uint) 
  (image (buff 200)))
  (begin
    ;; Input validation
    (asserts! (and (> (len title) u0) (<= (len title) u200)) err-invalid-title) ;; Title must be non-empty and <= 200 bytes
    (asserts! (and (> (len description) u0) (<= (len description) u500)) err-invalid-description)
    (asserts! (> target u0) err-invalid-target) ;; Target must be a positive number
    (asserts! (> deadline block-height) err-invalid-deadline) ;; Deadline must be in the future
    ;; (asserts! (is-valid-image-url image) err-invalid-image) ;; Image must be a valid URL or format

    (let ((campaign-id (var-get number-of-campaigns)))

      ;; Store the new campaign data
      (map-insert campaigns campaign-id 
        { owner: owner, 
          title: title, 
          description: description, 
          target: target, 
          deadline: deadline, 
          amount-collected: u0, 
          image: image })
      (var-set number-of-campaigns (+ campaign-id u1)) ;; Increment the number of campaigns
      (ok campaign-id))))

