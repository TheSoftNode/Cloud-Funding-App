;; Check if a buffer starts with a given prefix
(define-private (starts-with (buffer (buff 200)) (prefix (buff 10)))
  (let ((buffer-len (len buffer))
        (prefix-len (len prefix)))
    (and 
      (>= buffer-len prefix-len) ;; Ensure the buffer is at least as long as the prefix
      (is-eq (buffer-len prefix-len)) ;; Compare the two strings
    )
  )
)

;; Validate if the provided image URL is valid
(define-private (is-valid-image-url (img-url (buff 200)))
  (let ((valid-url-prefixes (list (buff "http://") (buff "https://"))))
    (or (some (lambda (prefix) (starts-with img-url prefix)) valid-url-prefixes)
        (starts-with img-url (buff "data:image/"))))) ;; Accept data URLs as well
