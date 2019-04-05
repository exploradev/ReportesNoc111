#!/usr/bin/python
# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time


#conecto con la app
browser = webdriver.Firefox()
browser.get('http://localhost:4040/')




#iniciando sesion
input_usuario = browser.find_element_by_id('user')
input_usuario.send_keys('irene.albert')

input_password = browser.find_element_by_id('password')
input_password.send_keys('Asesor01' + Keys.RETURN)





#click en boton de captura a domicilio
time.sleep(5)
boton_domicilio = browser.find_element_by_id('capturadomiciliomodalbtn')
boton_domicilio.click()

#se llenan los campos de primer pestaña
#time.sleep(1)

dom_folio = browser.find_element_by_id('dom_folio')
dom_folio.send_keys('1234')

dom_folio = browser.find_element_by_id('btn_domsearchdata')
dom_folio.click()

#dom_cliente = browser.find_element_by_id('dom_cliente')
#dom_cliente.send_keys('Jon Doe')

#dom_fechaentrega = browser.find_element_by_id('dom_fechaentrega')
#dom_fechaentrega.send_keys('2019/03/22')

#dom_horarioentrega = browser.find_element_by_id('dom_horarioentrega')
#dom_horarioentrega.send_keys('despues de las 3pm')

dom_contacto = browser.find_element_by_id('dom_contacto')
dom_contacto.send_keys('9999000000')

dom_numamigrar = browser.find_element_by_id('dom_numamigrar')
dom_numamigrar.send_keys('9999111111')

dom_destino = browser.find_element_by_id('dom_destino')
dom_destino.send_keys('Merida')

dom_direccion = browser.find_element_by_id('dom_direccion')
dom_direccion.send_keys('27 numero 185')

dom_colonia = browser.find_element_by_id('dom_colonia')
dom_colonia.send_keys('Bojorquez')

dom_referencias = browser.find_element_by_id('dom_referencias')
dom_referencias.send_keys('2 pisos rejas blancas')

#se avanza a la segunda pestaña
#time.sleep(1)
datosdeltramite = browser.find_element_by_id('datosdeltramite')
datosdeltramite.click()

#se llenan los campos de segunda pestaña
#time.sleep(1)


#time.sleep(1)


#dom_plan = select(browser.find_element_by_id('dom_plan'))
#dom_plan.select_by_index(1)

#dom_tipoactivacion = select(browser.find_element_by_id('dom_tipoactivacion'))
#dom_tipoactivacion.select_by_index(1)

#dom_ctaconsolidar = browser.find_element_by_id('dom_ctaconsolidar')
#dom_ctaconsolidar.send_keys('')

#dom_email = browser.find_element_by_id('dom_email')
#dom_email.send_keys('')

dom_financiamiento = browser.find_element_by_id('dom_financiamiento')
dom_financiamiento.send_keys('5200.00')

#dom_equipo = browser.find_element_by_id('dom_equipo')
#dom_equipo.send_keys('')

dom_imei = browser.find_element_by_id('dom_imei')
dom_imei.send_keys('3213216546549871')

dom_concepto = browser.find_element_by_id('dom_concepto')
dom_concepto.send_keys('1 renta por adelantado y deposito en garantia')

#se deja a criterio el momento a darle click al boton de enviar captura
