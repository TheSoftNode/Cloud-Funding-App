;; A crowdfunding contract that allows users to create campaign, donate to them, and retrieve campaign information.

;; Errors
(define-constant  err-deadline-in-past (err u100))
(define-constant err-campaign-not-found (err u404))
(define-constant err-send-funds-failed (err u102))
(define-constant err-invalid-owner (err u205))
(define-constant err-invalid-title (err u200))
(define-constant err-invalid-description (err u201))
(define-constant err-invalid-target (err u202))
(define-constant err-invalid-deadline (err u203))
(define-constant err-invalid-image (err u204))
(define-constant err-list-full (err u3))
(define-constant err-map-set-failed (err u205))
(define-constant err-invalid-amount (err u206))
(define-constant err-transfer-failed (err u207))
(define-constant err-too-many-donators (err u208))
(define-constant err-too-many-donations (err u209))


;; Data variable to track the total number of campaigns created, used for generating unique campaign IDs.
(define-data-var number-of-campaigns uint u0)

;; Campaign structure
;; Each campaign has an owner, title, description, target, deadline, amount collected, and lists of donators and donations
(define-map campaigns
    uint
    { owner: principal,
      title: (string-ascii 200),
      description: (string-ascii 502),
      target: uint,
      deadline: uint,
      amount_collected: uint,
      image: (string-ascii 200) 
})

;; Define a mapping to store the donators and their respective donations for each campaign.
(define-map campaign-donators uint {donators: (list 100 principal), donations: (list 100 uint)})


;; Create a new campaign
(define-public (create-campaign 
  (owner principal) 
  (title (string-ascii 200)) 
  (description (string-ascii 502)) 
  (target uint) 
  (deadline uint) 
  (image (string-ascii 200)))
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
          amount_collected: u0, 
          image: image })
      (var-set number-of-campaigns (+ campaign-id u1)) ;; Increment the number of campaigns
      (ok campaign-id))))
      
(define-read-only (get-campaign (campaign-id uint))
  (match (map-get? campaigns campaign-id)
    campaign (ok campaign) ;; If campaign is found, return it wrapped in `ok`
    (err u101) ;; If not found, return an error response
  )
)


(define-read-only (get-donators (campaign-id uint))
  (let
    ((campaign-donators-data (default-to 
      { donators: (list), donations: (list) } 
      (map-get? campaign-donators campaign-id))))
    (ok {
      donators: (get donators campaign-donators-data),
      donations: (get donations campaign-donators-data)
    })
  )
)



(define-public (donate-to-campaign (campaign-id uint))
  (let
    (
      (amount (stx-get-balance tx-sender))
      (campaign (unwrap! (map-get? campaigns campaign-id) (err err-campaign-not-found)))
      (campaign-donators-data (default-to 
        { donators: (list), donations: (list) } 
        (map-get? campaign-donators campaign-id)))
    )
    (asserts! (> amount u0) (err err-invalid-amount))
    (let
      (
        (new-donators (unwrap! (as-max-len? (append (get donators campaign-donators-data) tx-sender) u100) (err err-too-many-donators)))
        (new-donations (unwrap! (as-max-len? (append (get donations campaign-donators-data) amount) u100) (err err-too-many-donations)))
        (new-amount-collected (+ (get amount_collected campaign) amount))
      )
      (match (stx-transfer? amount tx-sender (get owner campaign))
        success 
          (begin
            (map-set campaigns campaign-id
              (merge campaign { amount_collected: new-amount-collected }))
            (map-set campaign-donators campaign-id
              { donators: new-donators, 
                donations: new-donations })
            (ok true))
        error (err err-transfer-failed))
    )
  )
)


