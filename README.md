# MUVA: VISIÓN ROBÓTICA. PRÁCTICA 1

## Holonómico I

Tras conseguir instalar y ejecutar el Docker en mi portátil, empiezo las primeras pruebas para el procesamiento de imagen. Haciendo una detección del rojo y calculando un centroide, en función de la posición del centroide de la línea roja respecto al centro de la imagen, voy implementando un controlador reactivo que fija la velocidad angular y la velocidad máxima para ir recto. Con estas primeras pruebas consigo estar cerca de los cuatro minutos. Tenía bastante bajas las velocidades e ir probando y consigo llegar a los 3 minutos.  
El portátil va bastante lento y se me hace problemático llevar a cabo la práctica a pesar de tener un i7 de 11ª generación y 16 GB de RAM; se me queda colgado cada dos por tres y tengo que estar reiniciando el Docker y entrando y saliendo de la web incluso con pequeños cambios de código. Considero para el próximo día de trabajo usar el Mac mini M2 Pro que tengo para ver si ahí consigo que vaya mejor.

## Holonómico II

Instalo y ejecuto el ejercicio de Unibotics en el Mac mini y va sin problemas a pesar de los fallos de conexión puntuales del Docker y los reinicios que tengo que hacer del mismo. En este momento, paso a cambiar a un controlador PID. El script realiza lo siguiente:

- **Procesa la imagen:** Detecta la línea roja en la parte central de la imagen y obtiene su centroide.
- **Decide si es recta o curva:** Analiza la posición del centroide y la forma de la línea para determinar si el vehículo va en línea recta o está girando.
- **Ajusta la dirección:** Utiliza dos controladores PID (uno para rectas y otro para curvas) para corregir la trayectoria y mantener el coche en la línea.
- **Controla la velocidad:** Reduce la velocidad en curvas y acelera en rectas para un movimiento más estable.
- **Muestra la imagen procesada:** Muestra información en pantalla como la velocidad y el error de seguimiento entre otros.




https://github.com/user-attachments/assets/726b75f5-f423-4ac5-ad14-fff6adc08662



Llego a conseguir un tiempo de vuelta cercano a 1 minuto y 10 segundos aproximadamente. Se observa claramente que oscila bastante en curvas, que por momentos casi se pierde, y que en zonas donde la curva no es pronunciada podría aumentarse la velocidad hasta llegar a los 14 km/h.

## Holonómico III


Modifico la Kp, del anterior, para hacerlo más suave y consigo que aunque aún por algunos tramos oscila, lo hace mucho menos que la versión anterior. Y consiguiendo la vuelta en 1min 10seg aprox.



https://github.com/user-attachments/assets/269bc7d8-81ca-4cbd-aeb4-5e60e1d33d9c




## Ackerman I

Empiezo a implementar el script que tenia en ackerman pero veo que no funciona y que hace cosas que estan bastante mal por lo que cambio de estrategia e implemento lo siguiente:

1. Captura y Preprocesamiento de la Imagen

Obtengo imágenes desde la cámara del robot, una vez adquirida la imagen, se recorta para enfocarse en la región de interés, limitando el área de análisis a la parte más logica de vision de la imagen, es decir, elimino la franja inferior y superior. Luego paso la imagen a HSV, ya que la detección de color en HSV es más robusta. Aplico filtros para detectar el color rojo mediante umbrales en HSV usando dos rangos para capturar tonos de rojo que pueden encontrarse en diferentes regiones del espectro HSV.

Para mejorar la segmentación, aplico operaciones morfológicas (apertura y cierre) para eliminar ruido y cerrar pequeños huecos en caso de que hubiese por cualquier razon.


2. Extracción de Características de la Línea

Una vez generada la máscara binaria, extraigo contornos y selecciono el de mayor área como la línea principal a seguir con el findcontours. 
Calculo el centroide de la línea para obtener la posición del robot respecto a la línea.
Selecciono puntos en los bordes de línea para estimar la curvatura, y los uno para intentar asi ver si puedo adivinar si estoy en curva o no en funcion de sus angulos de union.

![image](https://github.com/user-attachments/assets/8e82fe6e-88b7-445c-8f09-a0943d4a20d6)

Como se ve en la imagen se estan formando angulos entre los dos extremos de la linea por lo que la media de los angulos, esta totalmente oscilando y pasando de curva a recta sin mucho sentido, como se ve en el video. Haciendo a su vez que el coche oscile totalmente.

3. Control del Robot con PID Adaptativo

Calculo el error de seguimiento como la distancia del centroide de la línea al centro de la imagen, y el controlador PID varia en funcion de si esta en curvas y en rectas, es decir, el PID varia dinámicamente en función de la curvatura de la línea con este codigo:

kp = KP_BASE * (1.0 + 0.8 * curvatura)
ki = KI_BASE * (1.0 - 0.6 * curvatura)
kd = KD_BASE * (1.0 + 1.2 * curvatura)

- Kp (Proporcional) aumenta en curvas:
Como el Kp influye en qué tan rápido el coche responde al error, en curvas, un Kp más alto mejora la capacidad de girar rápidamente sin desviarse demasiado, por tanto lo multiplico por (1.0 + 0.8 × curvatura), para que aumente hasta un 80% en curvas pronunciadas.

- Ki (Integral) disminuye en curvas:
El componente integral acumula error con el tiempo, asi que en curvas, puede generar inestabilidad si lo mantengo alto, ya que puede provocar un sobreajuste y oscilaciones, entonces la reduzco en 60% en curvas pronunciadas con (1.0 − 0.6 × curvatura).

- Kd (Derivativo) aumenta en curvas:
El término derivativo ayuda a amortiguar cambios bruscos, asi que en curvas, que el error cambia rápidamente, necesitaré un Kd más alto para evitar giros agresivos. Por lo que se aumenta en 120% en curvas pronunciadas con (1.0 + 1.2 × curvatura).

El resultado de este código es el siguiente en curvas:



https://github.com/user-attachments/assets/c3a9cae4-42ee-463e-a9ff-415e6e06fa0f




Y el siguiente en rectas:


https://github.com/user-attachments/assets/24ba596b-32be-4f07-974e-6b2ac49821b0


Por lo que vemos que oscila mucho, y probablemente sea por el tema de la detección de la curva porque cuando esta mas con la linea en la zona lateral de la pantalla, los puntos y las líneas que lo unen parecen ser más rectas.


## Ackerman II

Decido cambiar de nuevo el codigo que tenia porque creo que es demasiado enrevesado y me esta dando resultados un poco raros, y paso a algo mas sencillo. Detecto el centroide y calculo distancia a la linea central.



https://github.com/user-attachments/assets/c1ad22d6-f742-47cf-8313-9e32e4aa96b9


Como vemos no gira bien asi que intento cambiar de estrategia.


## Ackerman III

Ahora tras pensar que al conducir, nosotros simplemente frenamos y aceleramos (no tenemos tendencia a arriesgar pensando: "Venga, voy a seguir conduciendo y voy a ver hasta qué punto manteniendo la velocidad de la recta actual tengo que girar el volante para poder coger esta curva...", que en cierta manera es el Kp, la intensidad de la reaccion ante el cambio del estímulo), establezco una estrategia que en funcion de la lejania del centroide de la linea respecto a la linea central de la imagen, voy reduciendo la velocidad: cuanto más lejos estoy, más aminoro) y he conseguido resultados por ahora bastante aceptables en mi opinión. Llego a dar una vuelta rondando los 360 segundos, en el circuito simple, sin oscilar, en mi opinión, ya que aunque se ve que se desplaza el centroide de la línea roja respecto de la línea central, cuando ves el coche desde fuera el coche sigue estando sobre la línea roja.




https://github.com/user-attachments/assets/99eef041-b7b2-439f-a191-b0c9f410cb54



Ahora he probado en otro circuito para ver lo robusto que es el controlador y el script de navegacion del coche y vemos que sigue sin oscilar demasiado y que mantiene velocidades aceptables pero al haber curvas mas cerradas, no consigo centrar el coche, aún poniendo que cuando tenga demasiado error la velocidad este cercana a cero.



https://github.com/user-attachments/assets/cbc95651-6a84-4f0c-91bf-818e702ac05f









# MUVA: VISIÓN ROBÓTICA. PRÁCTICA 2


##  Objetivo

En esta práctica me propuse desarrollar un sistema básico de reconstrucción 3D utilizando visión estéreo. La idea era aplicar conceptos como la detección de bordes, búsqueda de correspondencias en líneas epipolares y triangulación, utilizando las herramientas proporcionadas por la API de HAL y la interfaz gráfica de GUI.


## 🧠 Enfoque general

La reconstrucción se basa en el principio de que si se puede identificar un mismo punto en dos imágenes (izquierda y derecha), y se conoce la posición de las cámaras, entonces es posible calcular su posición 3D mediante geometría.

El procedimiento lo dividí en tres grandes bloques:


### 1. Detección de puntos de interés (bordes)

En lugar de buscar keypoints complejos (como SIFT o ORB), opté por una estrategia más controlada: usar Canny para detectar bordes y después filtrar los resultados con un suavizado bilateral. Esto me permite asegurar que solo trabajo con bordes significativos, evitando ruido.

Selecciono puntos de borde de la imagen izquierda cada N píxeles para no sobrecargar el sistema, y además para mantener un rendimiento aceptable en la visualización.


![Captura de pantalla 2025-04-13 195526](https://github.com/user-attachments/assets/a078cb2a-c6e0-43e1-aaf8-94e6b7292766)

### 2. Matching: búsqueda de correspondencias estéreo

Para cada punto detectado en la imagen izquierda, busco su correspondencia en la imagen derecha, restringiendo la búsqueda a su línea epipolar (es decir, misma coordenada Y). Esto simplifica mucho el proceso y es coherente con la configuración estéreo horizontal.

Uso correlación de ventanas (template matching) para comparar la región alrededor del punto en la imagen izquierda con diferentes posiciones en la derecha. Para evitar comparaciones innecesarias, solo lo hago sobre píxeles que también son bordes en la imagen derecha.

Solo acepto una correspondencia si la similitud (correlación) supera un cierto umbral, lo que ayuda a descartar falsos positivos.

![image](https://github.com/user-attachments/assets/0acfabd8-ecac-423f-ad63-09e6f840131a)


### 3. Triangulación y visualización

Una vez tengo los puntos correspondientes en ambas imágenes, utilizo la API de HAL para:

- Transformar las coordenadas gráficas en coordenadas ópticas
- Obtener las retroproyecciones 3D desde cada cámara

Con esto, genero dos rayos en el espacio (uno por cada cámara) y calculo su punto medio más cercano, asumiendo que la intersección exacta es poco probable debido al ruido. Este punto medio es el que tomo como resultado de la triangulación.

Finalmente, añado cada punto a la nube de puntos 3D que se va mostrando con `GUI.ShowNewPoints()`. También dibujo las correspondencias con `GUI.showImageMatching()` para ir viendo el proceso.


https://github.com/user-attachments/assets/e49cc916-eb82-4964-9295-fa62aba788e9




