;; A crowdfunding contract that allows users to create campaign, donate to them, and retrieve campaign information.

;; Errors
(define-constant  err-deadline-in-past (err u100))
(define-constant err-campaign-not-found (err u101))
(define-constant err-send-funds-failed (err u102))

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