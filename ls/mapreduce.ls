(require core)

(def foldl
 (fn (:f :acc :xs)
   (((nil? :xs)
      (cons
       (fn (_ :acc _) :acc)
       (fn (:f :acc :xs)
         (foldl :f (:f :acc (car :xs)) (cdr :xs))))
     ) :f :acc :xs)))

(def mapr
 (fn (:f :xs)
   (foldl
    ((fn (:f :acc :x) (cons (:f :x) :acc)) :f)
    nil
    :xs)))

(def identity
 (fn (:x) :x))

(def reverse
 (fn (:xs)
   (mapr identity :xs)))

(def map
 (fn (:f :xs)
   (reverse (mapr :f :xs))))

(def delay
 (fn (:f _) :f))

(def force
 (fn (:delayed)
   (:delayed trigger-not-used)))
